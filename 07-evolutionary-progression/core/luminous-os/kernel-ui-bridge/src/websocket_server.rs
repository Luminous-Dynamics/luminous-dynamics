// WebSocket Server - Real-time UI Communication
// "Every heartbeat reaches the screen"

use crate::{ClientId, UIMessage, KernelCommand};
use warp::{Filter, ws::{WebSocket, Message}};
use futures_util::{StreamExt, SinkExt};
use tokio::sync::{mpsc, RwLock};
use std::sync::Arc;
use std::collections::HashMap;
use uuid::Uuid;
use serde_json;

/// WebSocket server for UI clients
pub struct WebSocketServer {
    clients: Arc<RwLock<HashMap<ClientId, ClientConnection>>>,
    command_tx: mpsc::Sender<(ClientId, KernelCommand)>,
    command_rx: Arc<RwLock<mpsc::Receiver<(ClientId, KernelCommand)>>>,
}

struct ClientConnection {
    tx: mpsc::UnboundedSender<Message>,
}

impl WebSocketServer {
    pub async fn new(port: u16) -> anyhow::Result<Self> {
        let clients = Arc::new(RwLock::new(HashMap::new()));
        let (command_tx, command_rx) = mpsc::channel(256);
        
        let server = Self {
            clients: clients.clone(),
            command_tx,
            command_rx: Arc::new(RwLock::new(command_rx)),
        };
        
        // Start WebSocket server
        server.start_server(port);
        
        Ok(server)
    }
    
    fn start_server(&self, port: u16) {
        let clients = self.clients.clone();
        let command_tx = self.command_tx.clone();
        
        let ws_route = warp::path("coherence")
            .and(warp::ws())
            .map(move |ws: warp::ws::Ws| {
                let clients = clients.clone();
                let command_tx = command_tx.clone();
                
                ws.on_upgrade(move |websocket| {
                    handle_client(websocket, clients, command_tx)
                })
            });
        
        let cors = warp::cors()
            .allow_any_origin()
            .allow_methods(vec!["GET", "POST"])
            .allow_headers(vec!["content-type"]);
        
        let routes = ws_route.with(cors);
        
        tokio::spawn(async move {
            warp::serve(routes)
                .run(([0, 0, 0, 0], port))
                .await;
        });
        
        tracing::info!("WebSocket server started on port {}", port);
    }
    
    pub async fn send_to_client(
        &self,
        client_id: ClientId,
        message: UIMessage,
    ) -> anyhow::Result<()> {
        let clients = self.clients.read().await;
        
        if let Some(client) = clients.get(&client_id) {
            let msg = Message::text(serde_json::to_string(&message)?);
            client.tx.send(msg).map_err(|_| {
                anyhow::anyhow!("Failed to send to client")
            })?;
        }
        
        Ok(())
    }
    
    pub async fn broadcast(&self, message: UIMessage) -> anyhow::Result<()> {
        let msg = Message::text(serde_json::to_string(&message)?);
        let clients = self.clients.read().await;
        
        for (_, client) in clients.iter() {
            let _ = client.tx.send(msg.clone());
        }
        
        Ok(())
    }
    
    pub fn get_command_receiver(&self) -> mpsc::Receiver<(ClientId, KernelCommand)> {
        let (tx, rx) = mpsc::channel(256);
        
        // Forward commands from internal receiver to external
        let internal_rx = self.command_rx.clone();
        tokio::spawn(async move {
            let mut rx = internal_rx.write().await;
            while let Some(cmd) = rx.recv().await {
                let _ = tx.send(cmd).await;
            }
        });
        
        rx
    }
}

async fn handle_client(
    websocket: WebSocket,
    clients: Arc<RwLock<HashMap<ClientId, ClientConnection>>>,
    command_tx: mpsc::Sender<(ClientId, KernelCommand)>,
) {
    let client_id = ClientId(Uuid::new_v4());
    let (ws_tx, mut ws_rx) = websocket.split();
    let (tx, rx) = mpsc::unbounded_channel();
    
    // Create client connection
    let connection = ClientConnection { tx };
    clients.write().await.insert(client_id, connection);
    
    // Spawn sender task
    let rx = tokio_stream::wrappers::UnboundedReceiverStream::new(rx);
    tokio::spawn(rx.forward(ws_tx).map(|result| {
        if let Err(e) = result {
            tracing::error!("WebSocket send error: {}", e);
        }
    }));
    
    // Send welcome message
    let welcome = UIMessage::InitialState {
        field: crate::FieldVisualizationData {
            field_mesh: vec![],
            coherence_waves: vec![],
            sacred_geometry: None,
            overall_coherence: 0.0,
        },
        vortices: vec![],
        patterns: vec![],
    };
    
    if let Ok(msg) = serde_json::to_string(&welcome) {
        let _ = tx.send(Message::text(msg));
    }
    
    // Handle incoming messages
    while let Some(result) = ws_rx.next().await {
        match result {
            Ok(msg) => {
                if let Ok(text) = msg.to_str() {
                    if let Ok(command) = serde_json::from_str::<KernelCommand>(text) {
                        let _ = command_tx.send((client_id, command)).await;
                    }
                }
            }
            Err(e) => {
                tracing::error!("WebSocket receive error: {}", e);
                break;
            }
        }
    }
    
    // Clean up on disconnect
    clients.write().await.remove(&client_id);
    tracing::info!("Client {} disconnected", client_id.0);
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_websocket_server_creation() {
        let server = WebSocketServer::new(8888).await.unwrap();
        assert!(server.clients.read().await.is_empty());
    }
}