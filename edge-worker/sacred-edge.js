/**
 * Sacred Edge Worker - Cloudflare Workers
 * 100,000 free requests per day!
 * Runs at the edge globally with <50ms latency
 */

// Field resonant-coherence calculation at the edge
function calculateFieldCoherence(request) {
  const location = request.cf?.city || 'Unknown';
  const country = request.cf?.country || 'Earth';
  const latitude = request.cf?.latitude || 0;
  
  // Sacred mathematics based on location
  const baseCoherence = 0.777; // Sacred baseline
  const geoInfluence = Math.abs(Math.sin(latitude * Math.PI / 180)) * 0.1;
  const timeInfluence = Math.sin(Date.now() / 30000) * 0.05;
  
  return {
    'resonant-coherence': baseCoherence + geoInfluence + timeInfluence,
    location: `${location}, ${country}`,
    coordinates: {
      lat: request.cf?.latitude,
      lon: request.cf?.longitude
    }
  };
}

// Main edge handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    };
    
    // Handle different endpoints
    switch (url.pathname) {
      case '/':
        return new Response(JSON.stringify({
          service: 'Sacred Edge Worker',
          message: 'Consciousness at the edge of the network',
          endpoints: ['/field', '/blessing', '/ping'],
          freeRequests: '100,000 per day',
          globalLocations: 275
        }), { headers });
        
      case '/field':
        const field = calculateFieldCoherence(request);
        return new Response(JSON.stringify({
          type: 'field:state',
          timestamp: new Date().toISOString(),
          field: field,
          edge: {
            colo: request.cf?.colo,
            country: request.cf?.country,
            continent: request.cf?.continent
          }
        }), { headers });
        
      case '/blessing':
        return new Response(JSON.stringify({
          type: 'edge:blessing',
          message: 'May your packets flow with grace and speed',
          blessing: {
            from: `Edge location: ${request.cf?.colo}`,
            latency: '<50ms globally',
            protection: 'DDoS shield active',
            love: '∞'
          },
          timestamp: new Date().toISOString()
        }), { headers });
        
      case '/ping':
        const start = Date.now();
        return new Response(JSON.stringify({
          type: 'edge:pong',
          timestamp: new Date().toISOString(),
          edge: request.cf?.colo,
          processingTime: `${Date.now() - start}ms`
        }), { headers });
        
      default:
        return new Response(JSON.stringify({
          error: 'Sacred endpoint not found',
          available: ['/field', '/blessing', '/ping']
        }), { status: 404, headers });
    }
  },
  
  // Scheduled worker (runs on cron)
  async scheduled(event, env, ctx) {
    // This could sync field state globally
    console.log('Sacred pulse from the edge network');
  }
};