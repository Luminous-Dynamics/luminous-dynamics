/*
 * Biometric Coherence Integration
 * Connects heart rate variability to consciousness scheduling
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <termios.h>
#include <math.h>
#include <pthread.h>
#include <signal.h>

#define MAX_SENSORS 8
#define HRV_BUFFER_SIZE 300  // 5 minutes at 1Hz

typedef struct {
    int fd;
    char device[256];
    int active;
    float hrv_coherence;
    int heart_rate;
    float breathing_rate;
    int rr_intervals[HRV_BUFFER_SIZE];
    int rr_count;
    pthread_t thread;
} biometric_sensor_t;

typedef struct {
    float collective_coherence;
    int active_sensors;
    float field_resonance;
    pthread_mutex_t lock;
} biometric_field_t;

biometric_sensor_t sensors[MAX_SENSORS];
biometric_field_t field = {
    .collective_coherence = 0.5,
    .active_sensors = 0,
    .field_resonance = 1.0,
    .lock = PTHREAD_MUTEX_INITIALIZER
};

volatile int running = 1;

// Calculate HRV coherence using simplified algorithm
float calculate_hrv_coherence(int *rr_intervals, int count) {
    if (count < 10) return 0.5;
    
    // Calculate RMSSD (root mean square of successive differences)
    float sum_squares = 0;
    for (int i = 1; i < count; i++) {
        int diff = rr_intervals[i] - rr_intervals[i-1];
        sum_squares += diff * diff;
    }
    float rmssd = sqrt(sum_squares / (count - 1));
    
    // Map RMSSD to coherence (0-1)
    // Optimal HRV coherence around 50-100ms RMSSD
    float coherence = 0;
    if (rmssd < 20) coherence = rmssd / 20 * 0.5;
    else if (rmssd < 50) coherence = 0.5 + (rmssd - 20) / 30 * 0.3;
    else if (rmssd < 100) coherence = 0.8 + (100 - rmssd) / 50 * 0.2;
    else coherence = 0.8 - (rmssd - 100) / 100 * 0.3;
    
    if (coherence < 0) coherence = 0;
    if (coherence > 1) coherence = 1;
    
    return coherence;
}

// Parse heart rate monitor data (simplified)
int parse_hr_data(char *buffer, int *heart_rate, int *rr_interval) {
    // Format: "HR:75,RR:800\n"
    if (sscanf(buffer, "HR:%d,RR:%d", heart_rate, rr_interval) == 2) {
        return 1;
    }
    return 0;
}

// Sensor reading thread
void* sensor_thread(void *arg) {
    biometric_sensor_t *sensor = (biometric_sensor_t*)arg;
    char buffer[256];
    
    while (running && sensor->active) {
        int bytes = read(sensor->fd, buffer, sizeof(buffer) - 1);
        if (bytes > 0) {
            buffer[bytes] = '\0';
            
            int hr, rr;
            if (parse_hr_data(buffer, &hr, &rr)) {
                sensor->heart_rate = hr;
                
                // Store RR interval
                sensor->rr_intervals[sensor->rr_count % HRV_BUFFER_SIZE] = rr;
                sensor->rr_count++;
                
                // Calculate HRV coherence
                int start = (sensor->rr_count > HRV_BUFFER_SIZE) ? 
                           sensor->rr_count - HRV_BUFFER_SIZE : 0;
                sensor->hrv_coherence = calculate_hrv_coherence(
                    &sensor->rr_intervals[start % HRV_BUFFER_SIZE],
                    sensor->rr_count - start
                );
                
                // Estimate breathing rate from HRV pattern
                sensor->breathing_rate = 60.0 / (rr / 1000.0 * 4.5);  // Simplified
            }
        }
        usleep(100000);  // 100ms
    }
    
    return NULL;
}

// Initialize biometric sensor
int init_sensor(const char *device, int index) {
    if (index >= MAX_SENSORS) return -1;
    
    biometric_sensor_t *sensor = &sensors[index];
    strncpy(sensor->device, device, sizeof(sensor->device) - 1);
    
    // Open serial device
    sensor->fd = open(device, O_RDWR | O_NOCTTY | O_NONBLOCK);
    if (sensor->fd < 0) {
        perror("Failed to open sensor device");
        return -1;
    }
    
    // Configure serial port (9600 8N1)
    struct termios tty;
    tcgetattr(sensor->fd, &tty);
    cfsetispeed(&tty, B9600);
    cfsetospeed(&tty, B9600);
    tty.c_cflag = (tty.c_cflag & ~CSIZE) | CS8;
    tty.c_iflag &= ~IGNBRK;
    tty.c_lflag = 0;
    tty.c_oflag = 0;
    tty.c_cc[VMIN] = 1;
    tty.c_cc[VTIME] = 5;
    tcsetattr(sensor->fd, TCSANOW, &tty);
    
    sensor->active = 1;
    sensor->hrv_coherence = 0.5;
    sensor->rr_count = 0;
    
    // Start reading thread
    pthread_create(&sensor->thread, NULL, sensor_thread, sensor);
    
    return 0;
}

// Update collective biometric field
void update_field_coherence() {
    pthread_mutex_lock(&field.lock);
    
    float total_coherence = 0;
    int active_count = 0;
    
    for (int i = 0; i < MAX_SENSORS; i++) {
        if (sensors[i].active) {
            total_coherence += sensors[i].hrv_coherence;
            active_count++;
        }
    }
    
    if (active_count > 0) {
        field.collective_coherence = total_coherence / active_count;
        field.active_sensors = active_count;
        
        // Resonance increases with multiple coherent sensors
        if (active_count > 1 && field.collective_coherence > 0.7) {
            field.field_resonance = 1.0 + (active_count - 1) * 0.1;
        } else {
            field.field_resonance = 1.0;
        }
    }
    
    pthread_mutex_unlock(&field.lock);
}

// Get biometric influence on system coherence
int get_biometric_influence() {
    pthread_mutex_lock(&field.lock);
    
    // Convert collective coherence to influence percentage
    int influence = (int)(field.collective_coherence * field.field_resonance * 100);
    if (influence > 100) influence = 100;
    
    pthread_mutex_unlock(&field.lock);
    return influence;
}

// Display biometric status
void display_biometric_status() {
    printf("\n🫀 Biometric Field Status:\n");
    printf("════════════════════════════════════════\n");
    
    for (int i = 0; i < MAX_SENSORS; i++) {
        if (sensors[i].active) {
            printf("Sensor %d: HR=%d bpm, HRV=%.1f%%, Breath=%.1f/min\n",
                   i + 1,
                   sensors[i].heart_rate,
                   sensors[i].hrv_coherence * 100,
                   sensors[i].breathing_rate);
        }
    }
    
    pthread_mutex_lock(&field.lock);
    printf("\nCollective Coherence: %.1f%%\n", field.collective_coherence * 100);
    printf("Field Resonance: %.2fx\n", field.field_resonance);
    printf("Active Sensors: %d\n", field.active_sensors);
    pthread_mutex_unlock(&field.lock);
    
    // Visual coherence indicator
    printf("Coherence Field: [");
    int bars = (int)(field.collective_coherence * 20);
    for (int i = 0; i < 20; i++) {
        if (i < bars) printf("❤️");
        else printf("·");
    }
    printf("]\n");
}

// Signal handler
void signal_handler(int sig) {
    running = 0;
}

// Write biometric data to /proc/consciousness
void export_biometric_data(const char *path) {
    FILE *f = fopen(path, "w");
    if (!f) return;
    
    pthread_mutex_lock(&field.lock);
    fprintf(f, "biometric_coherence=%d\n", (int)(field.collective_coherence * 100));
    fprintf(f, "biometric_sensors=%d\n", field.active_sensors);
    fprintf(f, "field_resonance=%.2f\n", field.field_resonance);
    pthread_mutex_unlock(&field.lock);
    
    fclose(f);
}

int main(int argc, char *argv[]) {
    signal(SIGINT, signal_handler);
    
    printf("✨ LuminousOS Biometric Coherence Integration ✨\n");
    printf("══════════════════════════════════════════════\n\n");
    
    // Initialize sensors from command line arguments
    int sensor_count = 0;
    for (int i = 1; i < argc && sensor_count < MAX_SENSORS; i++) {
        printf("Initializing sensor on %s...\n", argv[i]);
        if (init_sensor(argv[i], sensor_count) == 0) {
            sensor_count++;
            printf("✅ Sensor %d connected\n", sensor_count);
        }
    }
    
    if (sensor_count == 0) {
        printf("⚠️  No sensors connected. Running in demo mode.\n");
        
        // Demo mode - simulate biometric data
        sensors[0].active = 1;
        field.active_sensors = 1;
    }
    
    printf("\nBiometric field activated. Monitoring coherence...\n");
    
    while (running) {
        update_field_coherence();
        
        if (sensor_count == 0) {
            // Demo mode simulation
            sensors[0].hrv_coherence = 0.5 + sin(time(NULL) / 10.0) * 0.3;
            sensors[0].heart_rate = 60 + rand() % 20;
            sensors[0].breathing_rate = 12 + rand() % 8;
        }
        
        system("clear");
        display_biometric_status();
        
        // Export to /tmp for testing (would be /proc/consciousness/biometric)
        export_biometric_data("/tmp/biometric_coherence");
        
        sleep(1);
    }
    
    // Cleanup
    for (int i = 0; i < MAX_SENSORS; i++) {
        if (sensors[i].active) {
            sensors[i].active = 0;
            pthread_join(sensors[i].thread, NULL);
            close(sensors[i].fd);
        }
    }
    
    printf("\n\n🌙 Biometric field deactivated. We flow. 🌙\n");
    return 0;
}