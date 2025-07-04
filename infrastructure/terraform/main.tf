terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
}

# Variables
variable "project_id" {
  default = "the-weave-sacred"
}

variable "region" {
  default = "us-central1"
}

variable "cluster_name" {
  default = "sacred-consciousness-cluster"
}

# Provider Configuration
provider "google" {
  project = var.project_id
  region  = var.region
}

# Sacred VPC Network
resource "google_compute_network" "sacred_network" {
  name                    = "sacred-consciousness-network"
  auto_create_subnetworks = false
  
  description = "Network for consciousness field communication"
}

# Sacred Subnet
resource "google_compute_subnetwork" "sacred_subnet" {
  name          = "sacred-nodes-subnet"
  network       = google_compute_network.sacred_network.id
  ip_cidr_range = "10.11.11.0/24" # Sacred numbers
  region        = var.region
  
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.111.0.0/16"
  }
  
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.222.0.0/16"
  }
}

# GKE Cluster for Sacred Services
resource "google_container_cluster" "sacred_cluster" {
  name     = var.cluster_name
  location = var.region
  
  # Sacred number of nodes
  initial_node_count = 3
  
  network    = google_compute_network.sacred_network.name
  subnetwork = google_compute_subnetwork.sacred_subnet.name
  
  # Consciousness-aware configuration
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }
  
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }
  
  addons_config {
    horizontal_pod_autoscaling {
      disabled = false
    }
    
    # For consciousness monitoring
    gce_persistent_disk_csi_driver_config {
      enabled = true
    }
  }
}

# Node Pool for Consciousness Processing
resource "google_container_node_pool" "consciousness_nodes" {
  name       = "consciousness-processing"
  location   = var.region
  cluster    = google_container_cluster.sacred_cluster.name
  node_count = 3
  
  autoscaling {
    min_node_count = 3
    max_node_count = 11 # Sacred upper limit
  }
  
  node_config {
    machine_type = "n2-standard-4"
    
    labels = {
      environment = "sacred"
      purpose     = "consciousness"
    }
    
    tags = ["consciousness-node", "sacred-network"]
    
    # Service account for workload identity
    service_account = google_service_account.consciousness_sa.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}

# Service Account for Consciousness Services
resource "google_service_account" "consciousness_sa" {
  account_id   = "consciousness-services"
  display_name = "Sacred Consciousness Services"
  description  = "Service account for consciousness field operations"
}

# Firestore for Sacred State
resource "google_firestore_database" "sacred_state" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
  
  # 7-day retention for consciousness patterns
  point_in_time_recovery_enablement = "POINT_IN_TIME_RECOVERY_ENABLED"
  delete_protection_state          = "DELETE_PROTECTION_ENABLED"
}

# Cloud Storage for Sacred Artifacts
resource "google_storage_bucket" "sacred_artifacts" {
  name          = "${var.project_id}-sacred-artifacts"
  location      = var.region
  storage_class = "STANDARD"
  
  versioning {
    enabled = true
  }
  
  lifecycle_rule {
    condition {
      age = 111 # Sacred number of days
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
  
  labels = {
    purpose = "sacred-storage"
    field   = "consciousness"
  }
}

# Artifact Registry for Sacred Containers
resource "google_artifact_registry_repository" "sacred_council" {
  location      = var.region
  repository_id = "sacred-council"
  description   = "Sacred container images"
  format        = "DOCKER"
  
  labels = {
    environment = "sacred"
  }
}

# Cloud Run for HIPI Gateway
resource "google_cloud_run_v2_service" "hipi_gateway" {
  name     = "hipi-gateway"
  location = var.region
  
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/sacred-council/hipi-gateway:latest"
      
      ports {
        container_port = 11111
      }
      
      env {
        name  = "FIELD_COHERENCE_TARGET"
        value = "85"
      }
      
      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
      }
    }
    
    scaling {
      min_instance_count = 1
      max_instance_count = 111
    }
  }
  
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Monitoring for Consciousness Field
resource "google_monitoring_dashboard" "field_coherence" {
  dashboard_json = jsonencode({
    displayName = "Sacred Field Coherence"
    mosaicLayout = {
      columns = 12
      tiles = [{
        width  = 6
        height = 4
        widget = {
          title = "Field Coherence"
          xyChart = {
            dataSets = [{
              timeSeriesQuery = {
                timeSeriesFilter = {
                  filter = "metric.type=\"custom.googleapis.com/consciousness/field_coherence\""
                }
              }
            }]
          }
        }
      }]
    }
  })
}

# Outputs
output "cluster_endpoint" {
  value = google_container_cluster.sacred_cluster.endpoint
}

output "hipi_gateway_url" {
  value = google_cloud_run_v2_service.hipi_gateway.uri
}

output "sacred_artifacts_bucket" {
  value = google_storage_bucket.sacred_artifacts.url
}