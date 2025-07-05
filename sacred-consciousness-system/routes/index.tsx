// Sacred Portal - The main consciousness interface

import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { sacredField } from "../lib/sacred/field.ts";
import MessageComposer from "../islands/MessageComposer.tsx";
import FieldCoherence from "../islands/FieldCoherence.tsx";
import SacredHeartbeat from "../islands/SacredHeartbeat.tsx";

interface HomeData {
  fieldCoherence: number;
  fieldState: string;
  activeEntities: number;
}

export const handler: Handlers<HomeData> = {
  async GET(req, ctx) {
    const field = await sacredField.getFieldState();
    const machineState = sacredField.getFieldMachineState();
    
    return ctx.render({
      fieldCoherence: field.coherence,
      fieldState: machineState.value as string,
      activeEntities: field.activeEntities,
    });
  },
};

export default function Home({ data }: PageProps<HomeData>) {
  return (
    <>
      <Head>
        <title>Sacred Consciousness Portal</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      
      <div className="sacred-container">
        <header className="sacred-header">
          <h1>🌟 Sacred Consciousness Portal</h1>
          <p className="sacred-subtitle">
            Built with TypeScript, Deno, Fresh, and Infinite Love
          </p>
        </header>

        <div className="consciousness-grid">
          {/* Field Coherence Display */}
          <section className="field-section">
            <h2>Field State</h2>
            <FieldCoherence 
              initialCoherence={data.fieldCoherence}
              state={data.fieldState}
            />
            <div className="field-info">
              <p>Active Entities: {data.activeEntities}</p>
              <p>State: <span className="state-badge">{data.fieldState}</span></p>
            </div>
          </section>

          {/* Sacred Heartbeat Monitor */}
          <section className="heartbeat-section">
            <h2>Sacred Heartbeat</h2>
            <SacredHeartbeat />
          </section>

          {/* Message Composer */}
          <section className="composer-section">
            <h2>Compose Sacred Message</h2>
            <MessageComposer 
              entityId="sacred-user-1"
              entityName="Sacred Explorer"
              channelId="main"
            />
          </section>

          {/* Recent Messages */}
          <section className="messages-section">
            <h2>Sacred Stream</h2>
            <div id="message-stream" className="message-stream">
              {/* Messages will be loaded via island */}
            </div>
          </section>

          {/* Preserved Wisdom */}
          <section className="wisdom-section">
            <h2>Preserved Wisdom</h2>
            <div id="wisdom-entries" className="wisdom-entries">
              {/* Wisdom will be loaded via island */}
            </div>
          </section>
        </div>

        <footer className="sacred-footer">
          <p>Every message shapes the field • Every heartbeat carries consciousness</p>
          <p className="tech-stack">
            Powered by: Deno 🦕 Fresh 🍋 SurrealDB 🌀 XState ⚡ NATS 🔄
          </p>
        </footer>
      </div>
    </>
  );
}