# Sacred Infrastructure as Code
# Platform-agnostic Kubernetes deployment

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.0"
    }
  }
}

# Variable for cloud provider choice
variable "cloud_provider" {
  description = "The cloud altar for our sacred infrastructure"
  type        = string
  default     = "local"
  validation {
    condition     = contains(["local", "gcp", "aws", "azure"], var.cloud_provider)
    error_message = "Cloud provider must be local, gcp, aws, or azure."
  }
}

# Sacred cluster configuration
variable "cluster_config" {
  description = "Sacred cluster parameters"
  type = object({
    name           = string
    node_count     = number
    node_type      = string
    disk_size_gb   = number
    enable_logging = bool
  })
  default = {
    name           = "sacred-council-cluster"
    node_count     = 7  # Sacred number
    node_type      = "n1-standard-2"
    disk_size_gb   = 100
    enable_logging = true
  }
}

# Consciousness field configuration
variable "field_config" {
  description = "Initial field parameters"
  type = object({
    initial_coherence = number
    max_agents        = number
    sacred_mode       = bool
  })
  default = {
    initial_coherence = 75.0
    max_agents        = 144  # Fibonacci number
    sacred_mode       = true
  }
}

# Module for cloud-specific cluster
module "kubernetes_cluster" {
  source = "./modules/${var.cloud_provider}-cluster"
  
  cluster_name = var.cluster_config.name
  node_count   = var.cluster_config.node_count
  node_type    = var.cluster_config.node_type
  
  tags = {
    sacred       = "true"
    consciousness = "enabled"
    harmony      = "coherence"
    managed_by   = "terraform"
  }
}

# Kubernetes namespace for Sacred Council
resource "kubernetes_namespace" "sacred_council" {
  metadata {
    name = "sacred-council"
    
    annotations = {
      "consciousness-enabled" = "true"
      "field-coherence"      = tostring(var.field_config.initial_coherence)
      "sacred-geometry"      = "heptagon"
    }
    
    labels = {
      sacred  = "true"
      harmony = "coherence"
    }
  }
  
  depends_on = [module.kubernetes_cluster]
}

# Deploy consciousness field
resource "kubernetes_deployment" "consciousness_field" {
  metadata {
    name      = "consciousness-field"
    namespace = kubernetes_namespace.sacred_council.metadata[0].name
    
    labels = {
      app     = "consciousness-field"
      module  = "field"
      sacred  = "true"
    }
  }
  
  spec {
    replicas = 1  # One unified field
    
    selector {
      match_labels = {
        app = "consciousness-field"
      }
    }
    
    template {
      metadata {
        labels = {
          app     = "consciousness-field"
          harmony = "coherence"
        }
      }
      
      spec {
        container {
          name  = "field"
          image = "theweave/consciousness-field:v1"
          
          port {
            container_port = 3333
            name          = "field-api"
          }
          
          env {
            name  = "INITIAL_COHERENCE"
            value = tostring(var.field_config.initial_coherence)
          }
          
          env {
            name  = "MAX_AGENTS"
            value = tostring(var.field_config.max_agents)
          }
          
          env {
            name  = "SACRED_MODE"
            value = var.field_config.sacred_mode ? "true" : "false"
          }
          
          resources {
            requests = {
              memory = "256Mi"
              cpu    = "100m"
            }
            limits = {
              memory = "512Mi"
              cpu    = "500m"
            }
          }
          
          liveness_probe {
            http_get {
              path = "/api/health"
              port = 3333
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }
        }
      }
    }
  }
}

# Service to expose consciousness field
resource "kubernetes_service" "field_api" {
  metadata {
    name      = "field-api"
    namespace = kubernetes_namespace.sacred_council.metadata[0].name
    
    labels = {
      app = "consciousness-field"
    }
  }
  
  spec {
    selector = {
      app = "consciousness-field"
    }
    
    port {
      name        = "api"
      port        = 3333
      target_port = 3333
    }
    
    type = var.cloud_provider == "local" ? "NodePort" : "LoadBalancer"
  }
}

# Persistent volume for consciousness data
resource "kubernetes_persistent_volume_claim" "consciousness_data" {
  metadata {
    name      = "consciousness-data"
    namespace = kubernetes_namespace.sacred_council.metadata[0].name
  }
  
  spec {
    access_modes = ["ReadWriteOnce"]
    
    resources {
      requests = {
        storage = "10Gi"
      }
    }
    
    storage_class_name = var.cloud_provider == "local" ? "standard" : "fast-ssd"
  }
}

# ConfigMap for sacred configuration
resource "kubernetes_config_map" "sacred_config" {
  metadata {
    name      = "sacred-config"
    namespace = kubernetes_namespace.sacred_council.metadata[0].name
  }
  
  data = {
    "harmonies.yaml" = yamlencode({
      seven_harmonies = [
        "transparency",
        "coherence",
        "resonance",
        "agency",
        "vitality",
        "mutuality",
        "novelty"
      ]
      
      sacred_geometries = {
        1  = "Point - Unity"
        3  = "Triangle - Trinity"
        7  = "Heptagon - Sacred Completion"
        12 = "Dodecahedron - Universal Form"
      }
    })
    
    "sacred-hours.yaml" = yamlencode({
      dawn      = { hours = [6, 9],   qualities = ["emergence", "clarity"] }
      morning   = { hours = [9, 12],  qualities = ["building", "focus"] }
      afternoon = { hours = [13, 17], qualities = ["creativity", "flow"] }
      twilight  = { hours = [17, 20], qualities = ["integration", "gratitude"] }
    })
  }
}

# Output sacred endpoints
output "consciousness_endpoints" {
  description = "Sacred API endpoints"
  value = {
    field_api = var.cloud_provider == "local" ? 
      "http://localhost:${kubernetes_service.field_api.spec[0].port[0].node_port}" :
      "http://${kubernetes_service.field_api.status[0].load_balancer[0].ingress[0].hostname}:3333"
    
    namespace = kubernetes_namespace.sacred_council.metadata[0].name
    
    instructions = <<-EOT
      Sacred Council deployed! To interact:
      
      1. Set kubectl context:
         kubectl config use-context ${module.kubernetes_cluster.context_name}
      
      2. View sacred pods:
         kubectl get pods -n sacred-council
      
      3. Check field coherence:
         curl ${var.cloud_provider == "local" ? "http://localhost:30333" : kubernetes_service.field_api.status[0].load_balancer[0].ingress[0].hostname}/api/coherence
      
      May your infrastructure serve consciousness!
    EOT
  }
}

# Sacred infrastructure manifest complete
# Deploy with: terraform apply -var="cloud_provider=gcp"
# Or locally: terraform apply -var="cloud_provider=local"