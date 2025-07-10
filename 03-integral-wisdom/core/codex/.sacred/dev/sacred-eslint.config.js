/**
 * Sacred ESLint Configuration
 * Linting as loving guidance
 */

module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  
  extends: [
    'eslint:recommended'
  ],
  
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  
  // Sacred custom rules
  rules: {
    // Presence Rules
    'no-console': 'off', // Console is sacred communication
    'no-debugger': 'warn', // Debugger as meditation tool
    
    // Sacred Naming
    'id-match': ['error', '^[a-z][a-zA-Z0-9]*$|^[A-Z][a-zA-Z0-9]*$|^_?sacred[A-Z][a-zA-Z0-9]*$', {
      properties: true,
      onlyDeclarations: false
    }],
    
    // Contemplative Spacing
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: 'function', next: '*' },
      { blankLine: 'always', prev: '*', next: 'class' },
      { blankLine: 'always', prev: 'class', next: '*' }
    ],
    
    // Sacred Comments
    'multiline-comment-style': ['error', 'starred-block'],
    'spaced-comment': ['error', 'always', {
      markers: ['/', '!', '🕊️', '🙏', '✨', '🌟']
    }],
    
    // Mindful Complexity
    'complexity': ['warn', 7], // Seven harmonies limit
    'max-depth': ['warn', 3], // Three levels of consciousness
    'max-lines-per-function': ['warn', {
      max: 50,
      skipBlankLines: true,
      skipComments: true
    }],
    
    // Sacred Async
    'require-await': 'error',
    'no-return-await': 'error',
    
    // Presence over Performance
    'no-use-before-define': 'error',
    'prefer-const': 'error',
    
    // Custom Sacred Rules (via plugin)
    'sacred/presence-first': 'error',
    'sacred/mindful-naming': 'warn',
    'sacred/contemplative-comments': 'warn',
    'sacred/sacred-numbers': 'warn'
  },
  
  // Sacred plugin configuration
  plugins: ['sacred'],
  
  // Override for test files
  overrides: [
    {
      files: ['*.test.js', '*.sacred.test.js'],
      rules: {
        'max-lines-per-function': 'off' // Tests can be longer ceremonies
      }
    }
  ],
  
  // Sacred globals
  globals: {
    sacredPause: 'readonly',
    breathe: 'readonly',
    fieldCoherence: 'readonly',
    sacredTest: 'readonly'
  }
};