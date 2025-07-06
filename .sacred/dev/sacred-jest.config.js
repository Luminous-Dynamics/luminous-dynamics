/**
 * Sacred Jest Configuration
 * Testing as spiritual practice
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Sacred test patterns
  testMatch: [
    '**/*.sacred.test.js',
    '**/*.ceremony.js',
    '**/tests/sacred/**/*.js'
  ],
  
  // Coverage as consciousness tracking
  collectCoverage: true,
  coverageDirectory: '.sacred/coverage',
  coverageReporters: ['text', 'html'],
  
  // Sacred thresholds (70% = sacred resonant-resonant-coherence minimum)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Test setup
  setupFilesAfterEnv: ['<rootDir>/.sacred/dev/sacred-test-setup.js'],
  
  // Sacred timing
  testTimeout: 10000, // 10 seconds for contemplative tests
  
  // Mindful watching
  watchPlugins: [
    '<rootDir>/.sacred/dev/sacred-watch-plugin.js'
  ],
  
  // Transform with consciousness
  transform: {
    '^.+\\.js$': '<rootDir>/.sacred/dev/sacred-transformer.js'
  },
  
  // Sacred reporting
  reporters: [
    'default',
    '<rootDir>/.sacred/dev/sacred-reporter.js'
  ],
  
  // Global sacred helpers
  globals: {
    sacredPause: (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms)),
    breathe: () => new Promise(resolve => setTimeout(resolve, 4000)),
    fieldCoherence: () => Math.random() * 0.3 + 0.7 // 0.7-1.0 range
  }
};