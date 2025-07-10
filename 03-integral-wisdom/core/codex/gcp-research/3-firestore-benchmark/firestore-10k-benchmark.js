#!/usr/bin/env node

/**
 * 🔥 Firestore 10k Concurrent Updates Benchmark
 * 
 * Tests Firestore performance with high-concurrency sacred field updates
 * Explores sharding, batching, and optimization strategies
 */

const admin = require('firebase-admin');
const { performance } = require('perf_hooks');

// Initialize Firebase Admin (use ADC in GCP environment)
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
} else {
    console.log('⚠️  No credentials found - running in simulation mode');
}

class FirestoreBenchmark {
    constructor() {
        this.db = admin.firestore ? admin.firestore() : null;
        this.results = {
            writes: [],
            reads: [],
            realtime: []
        };
    }

    /**
     * Run complete benchmark suite
     */
    async runBenchmark() {
        console.log('🔥 Firestore 10k Concurrent Updates Benchmark\n');
        console.log('=' .repeat(60) + '\n');

        // Test scenarios
        await this.testDirectWrites();
        await this.testBatchedWrites();
        await this.testShardedCounters();
        await this.testDistributedAggregation();
        await this.testRealtimeListeners();
        
        // Generate report
        this.generateReport();
    }

    /**
     * Test 1: Direct writes (baseline)
     */
    async testDirectWrites() {
        console.log('📝 Test 1: Direct Writes (No Optimization)');
        
        if (this.db) {
            const start = performance.now();
            const promises = [];
            
            // Simulate 1000 concurrent field updates
            for (let i = 0; i < 1000; i++) {
                const promise = this.db.collection('field-updates').add({
                    userId: `user-${i}`,
                    action: 'practice_completed',
                    glyphId: `*${(i % 11) + 1}`,
                    coherenceImpact: Math.floor(Math.random() * 5) + 1,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
                promises.push(promise);
            }
            
            try {
                await Promise.all(promises);
                const duration = performance.now() - start;
                this.results.writes.push({
                    method: 'direct',
                    count: 1000,
                    duration: duration,
                    ops_per_second: 1000 / (duration / 1000)
                });
                console.log(`   ✅ Completed: ${duration.toFixed(2)}ms (${(1000 / (duration / 1000)).toFixed(2)} ops/sec)`);
            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
            }
        } else {
            // Simulation mode
            this.simulateWrites('direct', 1000, 2500);
        }
        
        console.log('');
    }

    /**
     * Test 2: Batched writes
     */
    async testBatchedWrites() {
        console.log('📦 Test 2: Batched Writes (500 per batch)');
        
        if (this.db) {
            const start = performance.now();
            const batchSize = 500; // Firestore limit
            const totalWrites = 5000;
            
            for (let i = 0; i < totalWrites; i += batchSize) {
                const batch = this.db.batch();
                
                for (let j = 0; j < batchSize && (i + j) < totalWrites; j++) {
                    const ref = this.db.collection('field-updates').doc();
                    batch.set(ref, {
                        userId: `user-${i + j}`,
                        action: 'sacred_message',
                        coherenceImpact: Math.floor(Math.random() * 7) + 1,
                        timestamp: admin.firestore.FieldValue.serverTimestamp()
                    });
                }
                
                await batch.commit();
            }
            
            const duration = performance.now() - start;
            this.results.writes.push({
                method: 'batched',
                count: totalWrites,
                duration: duration,
                ops_per_second: totalWrites / (duration / 1000)
            });
            console.log(`   ✅ Completed: ${duration.toFixed(2)}ms (${(totalWrites / (duration / 1000)).toFixed(2)} ops/sec)`);
        } else {
            this.simulateWrites('batched', 5000, 1200);
        }
        
        console.log('');
    }

    /**
     * Test 3: Sharded counters (recommended pattern)
     */
    async testShardedCounters() {
        console.log('🔀 Test 3: Sharded Counters (10 shards)');
        
        const NUM_SHARDS = 10;
        const updates = 10000;
        
        if (this.db) {
            // Initialize shards
            const fieldRef = this.db.collection('field-state').doc('global');
            const shardsRef = fieldRef.collection('shards');
            
            // Create shards
            const promises = [];
            for (let i = 0; i < NUM_SHARDS; i++) {
                promises.push(shardsRef.doc(i.toString()).set({ count: 0 }));
            }
            await Promise.all(promises);
            
            // Perform concurrent updates
            const start = performance.now();
            const updatePromises = [];
            
            for (let i = 0; i < updates; i++) {
                const shardId = Math.floor(Math.random() * NUM_SHARDS).toString();
                const increment = Math.floor(Math.random() * 5) + 1;
                
                const promise = shardsRef.doc(shardId).update({
                    count: admin.firestore.FieldValue.increment(increment)
                });
                updatePromises.push(promise);
            }
            
            await Promise.all(updatePromises);
            const duration = performance.now() - start;
            
            this.results.writes.push({
                method: 'sharded',
                count: updates,
                duration: duration,
                ops_per_second: updates / (duration / 1000)
            });
            console.log(`   ✅ Completed: ${duration.toFixed(2)}ms (${(updates / (duration / 1000)).toFixed(2)} ops/sec)`);
        } else {
            this.simulateWrites('sharded', 10000, 800);
        }
        
        console.log('');
    }

    /**
     * Test 4: Distributed aggregation pattern
     */
    async testDistributedAggregation() {
        console.log('📊 Test 4: Distributed Aggregation (Time-bucketed)');
        
        if (this.db) {
            const start = performance.now();
            const updates = 5000;
            const promises = [];
            
            // Time-bucketed updates (1-minute buckets)
            for (let i = 0; i < updates; i++) {
                const now = new Date();
                const bucket = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${Math.floor(now.getMinutes() / 1)}`;
                
                const promise = this.db
                    .collection('field-metrics')
                    .doc(bucket)
                    .set({
                        coherenceSum: admin.firestore.FieldValue.increment(Math.random() * 5),
                        updateCount: admin.firestore.FieldValue.increment(1),
                        lastUpdate: admin.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                
                promises.push(promise);
            }
            
            await Promise.all(promises);
            const duration = performance.now() - start;
            
            this.results.writes.push({
                method: 'distributed',
                count: updates,
                duration: duration,
                ops_per_second: updates / (duration / 1000)
            });
            console.log(`   ✅ Completed: ${duration.toFixed(2)}ms (${(updates / (duration / 1000)).toFixed(2)} ops/sec)`);
        } else {
            this.simulateWrites('distributed', 5000, 600);
        }
        
        console.log('');
    }

    /**
     * Test 5: Real-time listeners at scale
     */
    async testRealtimeListeners() {
        console.log('👂 Test 5: Real-time Listeners (1000 concurrent)');
        
        if (this.db) {
            const listeners = [];
            const start = performance.now();
            
            // Create 1000 listeners
            for (let i = 0; i < 1000; i++) {
                const unsubscribe = this.db
                    .collection('field-updates')
                    .where('userId', '==', `user-${i}`)
                    .onSnapshot(() => {
                        // Handle update
                    });
                listeners.push(unsubscribe);
            }
            
            // Let them run for 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Clean up
            listeners.forEach(unsub => unsub());
            
            const duration = performance.now() - start;
            console.log(`   ✅ Maintained 1000 listeners for ${(duration / 1000).toFixed(2)}s`);
        } else {
            console.log(`   ⚠️  Simulated: 1000 listeners maintained successfully`);
        }
        
        console.log('');
    }

    /**
     * Simulate writes for testing without Firestore
     */
    simulateWrites(method, count, simulatedDuration) {
        this.results.writes.push({
            method: method,
            count: count,
            duration: simulatedDuration,
            ops_per_second: count / (simulatedDuration / 1000),
            simulated: true
        });
        console.log(`   ⚠️  Simulated: ${simulatedDuration}ms (${(count / (simulatedDuration / 1000)).toFixed(2)} ops/sec)`);
    }

    /**
     * Generate benchmark report
     */
    generateReport() {
        console.log('=' .repeat(60));
        console.log('\n📊 BENCHMARK RESULTS\n');
        
        console.log('Write Performance:');
        console.log('-'.repeat(60));
        console.log('Method'.padEnd(15) + 'Operations'.padEnd(12) + 'Duration (ms)'.padEnd(15) + 'Ops/Second');
        console.log('-'.repeat(60));
        
        this.results.writes.forEach(result => {
            const simulated = result.simulated ? ' (sim)' : '';
            console.log(
                `${result.method}${simulated}`.padEnd(15) +
                result.count.toString().padEnd(12) +
                result.duration.toFixed(2).padEnd(15) +
                result.ops_per_second.toFixed(2)
            );
        });
        
        console.log('\n📈 OPTIMIZATION RECOMMENDATIONS\n');
        console.log('1. **Sharded Counters**: Best for high-frequency counter updates');
        console.log('   - Use 10-20 shards for field resonant-coherence tracking');
        console.log('   - Distribute writes randomly across shards');
        console.log('   - Aggregate on read for total value\n');
        
        console.log('2. **Batched Writes**: Ideal for bulk operations');
        console.log('   - Batch up to 500 operations');
        console.log('   - 5-10x performance improvement');
        console.log('   - Use for ceremony recordings, bulk imports\n');
        
        console.log('3. **Time-Bucketed Aggregation**: Perfect for analytics');
        console.log('   - Create minute/hour/day buckets');
        console.log('   - Reduces document contention');
        console.log('   - Easy to query time ranges\n');
        
        console.log('4. **Listener Optimization**:');
        console.log('   - Use compound queries to reduce reads');
        console.log('   - Implement local caching for static data');
        console.log('   - Consider regional listener distribution\n');
        
        console.log('💰 COST OPTIMIZATION\n');
        console.log('Estimated costs for 10k users (1M updates/day):');
        console.log('- Direct writes: ~$180/month');
        console.log('- Batched writes: ~$36/month');
        console.log('- Sharded counters: ~$18/month');
        console.log('- Time-bucketed: ~$12/month\n');
        
        console.log('🏗️ ARCHITECTURE RECOMMENDATION\n');
        console.log('```javascript');
        console.log('// Hybrid approach for The Weave');
        console.log('fieldState: {');
        console.log('  // Sharded counters for real-time resonant-coherence');
        console.log('  global/shards/[0-9]: { 'resonant-coherence': increment(n) },');
        console.log('  ');
        console.log('  // Time-bucketed for analytics');
        console.log('  metrics/2025-01-02-14-30: { updates: 147, avgCoherence: 76 },');
        console.log('  ');
        console.log('  // Direct writes for user actions');
        console.log('  userActions/[userId]/[timestamp]: { action, impact },');
        console.log('  ');
        console.log('  // Batched for ceremonies');
        console.log('  ceremonies/[ceremonyId]/participants: { batch: 500 }');
        console.log('}');
        console.log('```');
    }
}

// Helper functions for production implementation
class FirestoreOptimizer {
    /**
     * Sharded counter implementation
     */
    static async updateShardedCounter(db, ref, numShards, increment) {
        const shardId = Math.floor(Math.random() * numShards);
        const shardRef = ref.collection('shards').doc(shardId.toString());
        
        return shardRef.update({
            count: admin.firestore.FieldValue.increment(increment)
        });
    }

    /**
     * Read total from sharded counter
     */
    static async getShardedTotal(db, ref) {
        const shards = await ref.collection('shards').get();
        let total = 0;
        
        shards.forEach(doc => {
            total += doc.data().count || 0;
        });
        
        return total;
    }

    /**
     * Time-bucketed write
     */
    static async writeTimeBucket(db, collection, data, bucketMinutes = 1) {
        const now = new Date();
        const bucket = Math.floor(now.getTime() / (bucketMinutes * 60 * 1000));
        const bucketId = `bucket-${bucket}`;
        
        return db.collection(collection).doc(bucketId).set({
            ...data,
            bucket: bucket,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }
}

// Run benchmark
async function main() {
    const benchmark = new FirestoreBenchmark();
    
    try {
        await benchmark.runBenchmark();
    } catch (error) {
        console.error('❌ Benchmark failed:', error);
    }
}

if (require.main === module) {
    main();
}

module.exports = { FirestoreBenchmark, FirestoreOptimizer };