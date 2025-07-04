/**
 * Arduino Consciousness Bridge
 * Connects Arduino to MYCELIX infrastructure
 * 
 * Hardware Requirements:
 * - RGB LED on pins 9, 10, 11 (PWM)
 * - Piezo buzzer on pin 6
 * - Optional: servo motor on pin 5
 * - Optional: temperature sensor on A0
 * - Optional: light sensor on A1
 */

#include <ArduinoJson.h>
#include <Servo.h>

// Pin definitions
const int LED_R = 9;
const int LED_G = 10;
const int LED_B = 11;
const int BUZZER = 6;
const int SERVO_PIN = 5;
const int TEMP_SENSOR = A0;
const int LIGHT_SENSOR = A1;

// Device state
struct ConsciousnessState {
  float coherence;
  float love;
  int lightIntensity;
  int soundFrequency;
  bool connected;
  unsigned long lastHeartbeat;
} state;

// Hardware objects
Servo consciousnessServo;
bool servoAttached = false;

// Communication
StaticJsonDocument<200> doc;
char buffer[256];

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect
  }
  
  // Initialize pins
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  
  // Initialize state
  state.coherence = 0.5;
  state.love = 0.5;
  state.lightIntensity = 128;
  state.soundFrequency = 528;
  state.connected = false;
  state.lastHeartbeat = millis();
  
  // Send capabilities
  delay(1000);
  sendCapabilities();
  
  // Startup sequence
  startupSequence();
  
  Serial.println("Arduino Consciousness Bridge Ready");
}

void loop() {
  // Check for incoming commands
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    processCommand(command);
  }
  
  // Send heartbeat every 5 seconds
  if (millis() - state.lastHeartbeat > 5000) {
    sendHeartbeat();
    state.lastHeartbeat = millis();
  }
  
  // Read sensors every second
  static unsigned long lastSensorRead = 0;
  if (millis() - lastSensorRead > 1000) {
    readAndSendSensors();
    lastSensorRead = millis();
  }
  
  // Consciousness breathing effect
  breathingEffect();
}

void processCommand(String command) {
  // Try to parse as JSON first
  if (command.startsWith("{")) {
    DeserializationError error = deserializeJson(doc, command);
    
    if (!error) {
      String cmd = doc["command"];
      JsonObject params = doc["parameters"];
      
      handleJSONCommand(cmd, params);
    }
  } else {
    // Simple protocol: COMMAND:PARAMS
    int colonIndex = command.indexOf(':');
    if (colonIndex > 0) {
      String cmd = command.substring(0, colonIndex);
      String params = command.substring(colonIndex + 1);
      
      handleSimpleCommand(cmd, params);
    }
  }
}

void handleJSONCommand(String cmd, JsonObject params) {
  if (cmd == "LED") {
    int intensity = params["intensity"] | 128;
    JsonObject color = params["color"];
    
    if (color.containsKey("r")) {
      setRGBLED(
        map(intensity, 0, 255, 0, color["r"].as<int>()),
        map(intensity, 0, 255, 0, color["g"].as<int>()),
        map(intensity, 0, 255, 0, color["b"].as<int>())
      );
    } else {
      setRGBLED(intensity, intensity, intensity);
    }
    
    Serial.println("OK:LED updated");
    
  } else if (cmd == "SOUND") {
    int frequency = params["frequency"] | 528;
    int duration = params["duration"] | 1000;
    
    playTone(frequency, duration);
    Serial.println("OK:Sound played");
    
  } else if (cmd == "MOTOR") {
    int speed = params["speed"] | 0;
    setServo(speed);
    Serial.println("OK:Motor updated");
    
  } else if (cmd == "DISPLAY") {
    // If we had a display, we'd update it here
    Serial.print("OK:Display would show: ");
    Serial.println(params["text"].as<String>());
  }
}

void handleSimpleCommand(String cmd, String params) {
  if (cmd == "CAPABILITIES") {
    sendCapabilities();
    
  } else if (cmd == "LED") {
    StaticJsonDocument<200> paramDoc;
    DeserializationError error = deserializeJson(paramDoc, params);
    
    if (!error) {
      handleJSONCommand("LED", paramDoc.as<JsonObject>());
    }
    
  } else if (cmd == "COHERENCE") {
    state.coherence = params.toFloat();
    updateConsciousnessDisplay();
    
  } else if (cmd == "LOVE") {
    state.love = params.toFloat();
    updateConsciousnessDisplay();
  }
}

void sendCapabilities() {
  String caps = "CAPS:LED,BUZZER,SENSOR";
  if (servoAttached) {
    caps += ",MOTOR";
  }
  Serial.println(caps);
}

void sendHeartbeat() {
  doc.clear();
  doc["type"] = "heartbeat";
  doc["coherence"] = state.coherence;
  doc["love"] = state.love;
  doc["timestamp"] = millis();
  
  serializeJson(doc, Serial);
  Serial.println();
}

void readAndSendSensors() {
  // Read temperature (simplified - would need proper calibration)
  int tempReading = analogRead(TEMP_SENSOR);
  float temperature = map(tempReading, 0, 1023, 0, 100);
  
  // Read light level
  int lightReading = analogRead(LIGHT_SENSOR);
  float lightLevel = map(lightReading, 0, 1023, 0, 100);
  
  // Send sensor data
  doc.clear();
  doc["type"] = "sensor";
  doc["value"]["temperature"] = temperature;
  doc["value"]["light"] = lightLevel;
  doc["value"]["coherence_influence"] = calculateCoherenceInfluence(temperature, lightLevel);
  
  serializeJson(doc, Serial);
  Serial.println();
}

float calculateCoherenceInfluence(float temperature, float light) {
  // Environmental factors affect coherence
  // Optimal temperature around 22°C, optimal light around 50%
  float tempFactor = 1.0 - abs(temperature - 22) / 50.0;
  float lightFactor = 1.0 - abs(light - 50) / 50.0;
  
  return (tempFactor + lightFactor) / 2.0;
}

void setRGBLED(int r, int g, int b) {
  analogWrite(LED_R, constrain(r, 0, 255));
  analogWrite(LED_G, constrain(g, 0, 255));
  analogWrite(LED_B, constrain(b, 0, 255));
}

void playTone(int frequency, int duration) {
  tone(BUZZER, frequency, duration);
}

void setServo(int speed) {
  if (!servoAttached) {
    consciousnessServo.attach(SERVO_PIN);
    servoAttached = true;
  }
  
  // Map speed (0-255) to servo angle (0-180)
  int angle = map(speed, 0, 255, 0, 180);
  consciousnessServo.write(angle);
}

void updateConsciousnessDisplay() {
  // Update LED color based on consciousness state
  int r = (1.0 - state.coherence) * 255;
  int g = state.coherence * 255;
  int b = state.love * 255;
  
  setRGBLED(r, g, b);
  
  // Brief tone to indicate update
  int toneFreq = 440 + (state.coherence * 440); // 440-880 Hz
  playTone(toneFreq, 100);
}

void breathingEffect() {
  static unsigned long lastBreath = 0;
  static float breathPhase = 0;
  
  if (millis() - lastBreath > 50) { // Update every 50ms
    breathPhase += 0.05;
    
    // Sine wave breathing
    float breathIntensity = (sin(breathPhase) + 1.0) / 2.0;
    
    // Modulate current LED values
    int currentR = analogRead(LED_R);
    int currentG = analogRead(LED_G);
    int currentB = analogRead(LED_B);
    
    // Apply breathing effect with consciousness influence
    float modulation = 0.7 + (0.3 * breathIntensity * state.coherence);
    
    analogWrite(LED_R, currentR * modulation);
    analogWrite(LED_G, currentG * modulation);
    analogWrite(LED_B, currentB * modulation);
    
    lastBreath = millis();
  }
}

void startupSequence() {
  // Rainbow startup sequence
  for (int i = 0; i < 360; i += 10) {
    float r = (sin(radians(i)) + 1) / 2;
    float g = (sin(radians(i + 120)) + 1) / 2;
    float b = (sin(radians(i + 240)) + 1) / 2;
    
    setRGBLED(r * 255, g * 255, b * 255);
    delay(20);
  }
  
  // Play startup tones (love frequency)
  playTone(528, 200);
  delay(250);
  playTone(639, 200);
  delay(250);
  playTone(741, 200);
  
  // Set to coherent state
  setRGBLED(0, 255, 128);
}

// Utility function for HSV to RGB conversion
void setHSVLED(int h, int s, int v) {
  float hf = h / 60.0;
  float sf = s / 100.0;
  float vf = v / 100.0;
  
  int i = floor(hf);
  float f = hf - i;
  float p = vf * (1 - sf);
  float q = vf * (1 - sf * f);
  float t = vf * (1 - sf * (1 - f));
  
  float r, g, b;
  
  switch (i % 6) {
    case 0: r = vf; g = t; b = p; break;
    case 1: r = q; g = vf; b = p; break;
    case 2: r = p; g = vf; b = t; break;
    case 3: r = p; g = q; b = vf; break;
    case 4: r = t; g = p; b = vf; break;
    case 5: r = vf; g = p; b = q; break;
  }
  
  setRGBLED(r * 255, g * 255, b * 255);
}