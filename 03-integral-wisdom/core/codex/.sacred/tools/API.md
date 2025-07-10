# 📖 Universal Safety System - API Reference

## Core Classes

### UniversalSafetyManager

Main orchestrator for the safety system.

```javascript
const UniversalSafetyManager = require('./universal-safety-manager.js');
```

#### Methods

##### `constructor()`
Creates new instance of the safety manager.

##### `async initialize()`
Initializes the manager, loading all detectors and learning database.
- **Returns**: `Promise<void>`
- **Throws**: Error if initialization fails

##### `async checkFile(filePath)`
Checks a file for safety issues using all enabled detectors.
- **Parameters**: 
  - `filePath` (string): Path to file to check
- **Returns**: `Promise<CheckResult>`
  ```javascript
  {
    aggregate: SafetyResult,
    detectorResults: Map<string, SafetyResult>,
    recommendations: Array<Recommendation>
  }
  ```

##### `async autoFix(filePath, checkResult)`
Attempts automatic fixes for detected issues.
- **Parameters**:
  - `filePath` (string): Path to file
  - `checkResult` (CheckResult): Result from checkFile()
- **Returns**: `Promise<Array<FixResult>>`

##### `async learnPattern(trapInfo)`
Reports new trap pattern to learning system.
- **Parameters**:
  - `trapInfo` (Object): Pattern information
- **Returns**: `Promise<void>`

---

### SafetyDetector (Base Class)

Base class for all safety detectors. Extend this to create custom detectors.

```javascript
const { SafetyDetector, SafetyResult } = require('./safety-modules/base-detector.js');
```

#### Constructor Options
```javascript
{
  name: 'detector_name',        // Unique identifier
  version: '1.0.0',            // Detector version
  severity: 'critical',        // critical|high|medium|low|guidance
  description: 'What it does', // Human-readable description
  patterns: [],               // Array of regex patterns
  enabled: true               // Enable/disable detector
}
```

#### Methods to Override

##### `async check(filePath, content)`
Main detection logic.
- **Parameters**:
  - `filePath` (string): File path
  - `content` (string, optional): File content
- **Returns**: `Promise<SafetyResult>`

##### `getRecommendation(result)`
Get fix recommendations based on check results.
- **Parameters**:
  - `result` (SafetyResult): Result from check()
- **Returns**: `Recommendation`

##### `canAutoFix()`
Whether this detector supports auto-fix.
- **Returns**: `boolean`

##### `async autoFix(filePath, result)`
Attempt to fix detected issues.
- **Parameters**:
  - `filePath` (string): File path
  - `result` (SafetyResult): Result from check()
- **Returns**: `Promise<AutoFixResult>`

---

### SafetyResult

Standardized result format for all detectors.

```javascript
new SafetyResult({
  safe: boolean,              // Is file safe to edit?
  score: number,              // 0-100 safety score
  warnings: Array<Warning>,   // Non-critical issues
  errors: Array<Error>,       // Critical issues
  metadata: Object            // Detector-specific data
})
```

#### Properties

- `safe` (boolean): Whether file is safe to edit
- `score` (number): Safety score 0-100
- `severity` (string): Calculated from errors/warnings
- `warnings` (Array): List of warning objects
- `errors` (Array): List of error objects
- `metadata` (Object): Additional detector data

---

### PatternLearningDB

Persistent storage for trap patterns and collective learning.

```javascript
const PatternLearningDB = require('./pattern-learning-db.js');
```

#### Methods

##### `async initialize()`
Load existing patterns from storage.

##### `async learnPattern(patternInfo)`
Add new pattern to database.
- **Parameters**:
  ```javascript
  {
    type: 'trap_type',
    pattern: 'pattern description',
    severity: 'critical',
    description: 'What it does',
    recovery: {
      method: 'use_write',
      steps: ['Step 1', 'Step 2']
    }
  }
  ```
- **Returns**: `Promise<string>` - Pattern ID

##### `async recordTrapAvoided(patternId)`
Increment trap avoidance counter.
- **Parameters**:
  - `patternId` (string): ID of avoided pattern

##### `getPatternsByType(type)`
Get all patterns of specific type.
- **Returns**: `Array<Pattern>`

##### `async generateReport()`
Generate comprehensive statistics report.
- **Returns**: `Promise<Report>`

##### `async shareWithNetwork()`
Share critical patterns with network (simulated).
- **Returns**: `Promise<ShareResult>`

---

## Built-in Detectors

### EncodingTrapDetector

Detects JSON encoding traps and dangerous patterns.

```javascript
const EncodingTrapDetector = require('./safety-modules/encoding-detector.js');
```

#### Detects:
- `${VAR}-` patterns (JSON encoding trap)
- Lines >1000 chars (warning) or >2000 (error)
- Unpaired Unicode surrogates
- Control characters (ASCII 0-31)
- Mixed line endings (CRLF/LF)

#### Auto-Fix Support: ✅
- Converts dangerous variable expansions
- Removes control characters
- Normalizes line endings

---

### SacredAwarenessDetector

Detects consciousness-serving patterns and shadow opportunities.

```javascript
const SacredAwarenessDetector = require('./safety-modules/sacred-awareness-detector.js');
```

#### Detects:
- Sacred patterns (love, wisdom, consciousness) - positive score
- Shadow patterns (harm, control, fear) - transformation opportunities
- Security context awareness
- File purpose alignment

#### Metadata Includes:
- `consciousnessAlignment` (number): Positive alignment score
- `opportunities` (Array): Growth opportunities found
- `sacredCount` (number): Sacred patterns found
- `shadowCount` (number): Shadow patterns for transformation

---

## CLI Tools

### universal-safety-manager.js

Main command-line interface.

```bash
node universal-safety-manager.js [options] <file>
```

#### Options:
- `--help, -h`: Show help
- `--fix`: Attempt automatic fixes
- `--learn`: Report new trap pattern

#### Exit Codes:
- `0`: File is safe
- `1`: File is unsafe
- `2`: Error occurred

---

### safe-edit-checker.sh

Quick bash script for safety checking.

```bash
./safe-edit-checker.sh <filename>
```

#### Output:
- Safety score (0-100)
- Warnings and recommendations
- Exit code indicates safety

---

### pattern-learning-db.js

Pattern database management.

```bash
node pattern-learning-db.js <command>
```

#### Commands:
- `report`: Show pattern statistics
- `share`: Share patterns with network
- `learn`: Interactive pattern learning

---

## Web Dashboard API

### Endpoints (when server running)

#### `GET /api/status`
Get system status and statistics.

#### `POST /api/check`
Check file safety via HTTP.
- **Body**: `{ filePath: string }`
- **Returns**: CheckResult

#### `GET /api/patterns`
Get known pattern list.

#### `POST /api/learn`
Submit new pattern.
- **Body**: Pattern object

---

## Integration Examples

### Pre-Edit Hook
```javascript
async function beforeEdit(filePath) {
  const manager = new UniversalSafetyManager();
  await manager.initialize();
  
  const result = await manager.checkFile(filePath);
  
  if (!result.aggregate.safe) {
    throw new Error('File unsafe for editing: ' + 
      result.recommendations[0].description);
  }
}
```

### Custom Detector
```javascript
class SQLInjectionDetector extends SafetyDetector {
  constructor() {
    super({
      name: 'sql_injection',
      severity: 'high',
      patterns: [
        /'\s*OR\s*'1'\s*=\s*'1/gi,
        /--\s*$/gm
      ]
    });
  }
  
  async check(filePath, content) {
    // Detection logic
  }
}
```

### Batch Processing
```javascript
async function checkDirectory(dir) {
  const manager = new UniversalSafetyManager();
  await manager.initialize();
  
  const files = await fs.readdir(dir);
  const results = [];
  
  for (const file of files) {
    const result = await manager.checkFile(
      path.join(dir, file)
    );
    results.push({ file, ...result });
  }
  
  return results;
}
```

---

## Error Handling

All methods may throw:
- `Error`: General errors
- `FileNotFoundError`: File doesn't exist
- `PermissionError`: No read access
- `InitializationError`: System not initialized

Best practice:
```javascript
try {
  const result = await manager.checkFile(file);
} catch (error) {
  console.error('Safety check failed:', error.message);
  // Default to safe behavior (use Write tool)
}
```

---

*For more examples, see the test files in the repository.*