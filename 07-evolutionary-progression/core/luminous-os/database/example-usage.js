// Example usage of LuminousOS Database Layer
import { db } from './database.service.js';

async function demonstrateDatabase() {
  try {
    // Initialize database connection
    console.log('🌟 Initializing LuminousOS Database...\n');
    await db.initialize({
      url: 'ws://localhost:8000/rpc',
      runMigrations: true
    });

    // Create a new user
    console.log('📝 Creating sacred user...');
    const user = await db.users.create({
      email: 'seeker@luminous.os',
      username: 'lightseeker',
      password_hash: 'hashed_password_here',
      sacred_name: 'Aurora',
      intention: 'To explore consciousness and connection',
      coherence_baseline: 0.65
    });
    console.log(`✓ Created user: ${user.sacred_name}\n`);

    // Record coherence reading
    console.log('📊 Recording coherence data...');
    const reading = await db.coherence.recordReading({
      user: user.id,
      personal_coherence: 0.72,
      network_coherence: 0.85,
      field_coherence: 0.68,
      heart_rate: 65,
      hrv: 62,
      breath_rate: 6
    });
    console.log(`✓ Coherence recorded: ${reading.personal_coherence}\n`);

    // Get available glyphs
    console.log('🔮 Fetching available glyphs...');
    const glyphs = await db.glyphs.getAvailableGlyphs(user.id);
    console.log(`✓ Found ${glyphs.length} available glyphs`);
    console.log(`  First glyph: ${glyphs[0]?.name}\n`);

    // Start a glyph practice
    console.log('🧘 Starting glyph practice...');
    const practice = await db.glyphs.startPractice(
      user.id,
      glyphs[0].id,
      0.72
    );
    console.log(`✓ Practice started: ${practice.id}\n`);

    // Complete the practice
    console.log('✨ Completing practice with insights...');
    const completed = await db.glyphs.completePractice(
      practice.id,
      0.78, // ending coherence
      0.82, // peak coherence
      ['Felt deep connection to source', 'Experienced unity consciousness']
    );
    console.log(`✓ Practice completed with quality: ${completed.practice_quality}\n`);

    // Send a sacred message
    console.log('💌 Sending sacred message...');
    const message = await db.messages.sendMessage(
      user.id,
      user.id, // to self for demo
      'gratitude',
      'Thank you for this sacred journey of discovery'
    );
    console.log(`✓ Message sent with blessing: "${message.blessing}"\n`);

    // Create a ceremony
    console.log('🕊️ Creating group ceremony...');
    const ceremony = await db.ceremonies.createCeremony(
      user.id,
      'heart_sync',
      'Collective heart coherence for planetary healing'
    );
    console.log(`✓ Ceremony created: ${ceremony.id}\n`);

    // Get dashboard data
    console.log('📈 Fetching dashboard data...');
    const dashboard = await db.getUserDashboardData(user.id);
    console.log('✓ Dashboard data:');
    console.log(`  Current coherence: ${dashboard.currentCoherence}`);
    console.log(`  Total practices: ${dashboard.stats.total_practices}`);
    console.log(`  Unread messages: ${dashboard.unreadMessageCount}\n`);

    // Get network field state
    console.log('🌐 Checking network field state...');
    const fieldState = await db.getNetworkFieldState();
    console.log('✓ Field state:');
    console.log(`  Network coherence: ${fieldState.networkCoherence}`);
    console.log(`  Field coherence: ${fieldState.fieldCoherence}`);
    console.log(`  Active ceremonies: ${fieldState.activeCeremonyCount}\n`);

    // Demonstrate transaction
    console.log('🔄 Running transaction...');
    await db.transaction([
      `UPDATE user SET total_practice_time = total_practice_time + 3600s WHERE id = "${user.id}"`,
      `UPDATE glyph_mastery SET times_practiced = times_practiced + 1 WHERE user = "${user.id}" AND glyph = "${glyphs[0].id}"`
    ]);
    console.log('✓ Transaction completed\n');

    // Health check
    console.log('❤️ Running health check...');
    const health = await db.healthCheck();
    console.log(`✓ Database health: ${health.healthy ? 'HEALTHY' : 'UNHEALTHY'}\n`);

    // Clean up
    console.log('🧹 Cleaning up...');
    await db.users.deactivate(user.id);
    console.log('✓ User deactivated');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Disconnect
    await db.disconnect();
    console.log('\n👋 Database connection closed');
  }
}

// Run the demonstration
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateDatabase().catch(console.error);
}

export default demonstrateDatabase;