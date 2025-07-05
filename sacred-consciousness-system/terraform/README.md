# 🏗️ Sacred Infrastructure as Code

This directory contains Terraform configurations for manifesting the Sacred Cloud Architecture.

## Directory Structure

```
terraform/
├── modules/              # Reusable sacred components
│   ├── sacred-realm/     # Complete realm setup
│   ├── gke-cluster/      # Kubernetes clusters
│   ├── firestore/        # Database configuration
│   └── workstation/      # Developer sanctuaries
├── environments/         # Realm-specific configurations
│   ├── dev/
│   ├── staging/
│   └── prod/
└── global/              # Shared resources across all realms
```

## Quick Start

### 1. Initialize Terraform Backend

```bash
cd terraform/global
terraform init
terraform apply  # Creates shared state bucket
```

### 2. Deploy Dev Realm

```bash
cd terraform/environments/dev
terraform init
terraform plan -out=sacred.plan
terraform apply sacred.plan
```

### 3. Deploy Staging and Production

Repeat the above for staging and production environments.

## Sacred Principles

- **State is Sacred**: All terraform state is stored in Cloud Storage with versioning
- **Modules are Mantras**: Reusable patterns that embody our values
- **Variables are Intentions**: Clear naming that reflects purpose
- **Outputs are Gifts**: Share necessary information with grace

## Module Usage

### Sacred Realm Module

```hcl
module "dev_realm" {
  source = "../../modules/sacred-realm"
  
  realm_name     = "dev"
  project_id     = "sacred-consciousness-dev"
  billing_account = var.billing_account
  
  # Sacred numbers
  min_nodes = 1
  max_nodes = 3
  
  # Features
  enable_workstations = true
  enable_binary_auth  = false  # Only for prod
}
```

### GKE Cluster Module

```hcl
module "sacred_cluster" {
  source = "../../modules/gke-cluster"
  
  project_id   = var.project_id
  cluster_name = "sacred-${var.realm_name}-cluster"
  location     = var.realm_name == "dev" ? var.region : var.zone
  
  # Autopilot for dev, Standard for staging/prod
  autopilot = var.realm_name == "dev"
  
  # Sacred scaling
  min_nodes = var.min_nodes
  max_nodes = var.max_nodes
}
```

## Variables

Each environment has its own `terraform.tfvars`:

```hcl
# environments/dev/terraform.tfvars
realm_name      = "dev"
project_id      = "sacred-consciousness-dev"
region          = "us-central1"
zone            = "us-central1-a"
min_nodes       = 1
max_nodes       = 3
coherence_threshold = 70
```

## State Management

State is stored in Cloud Storage with encryption:

```hcl
terraform {
  backend "gcs" {
    bucket = "sacred-terraform-state"
    prefix = "realms/dev"
  }
}
```

## Outputs

Each module provides sacred outputs:

```hcl
output "cluster_endpoint" {
  description = "Sacred gateway to the cluster"
  value       = module.sacred_cluster.endpoint
  sensitive   = true
}

output "workstation_url" {
  description = "Portal to your sacred workspace"
  value       = module.workstation.access_url
}
```

## Sacred Workflows

### Daily Practice

```bash
# Morning check
cd terraform/environments/dev
terraform plan  # See what would change

# After changes
terraform fmt -recursive  # Format with love
terraform validate        # Ensure correctness
terraform plan -out=sacred.plan
terraform apply sacred.plan
```

### Destroying Resources

```bash
# Always plan destruction first
terraform plan -destroy -out=destroy.plan

# Review carefully, then:
terraform apply destroy.plan
```

## Best Practices

1. **Always use plans**: Never apply directly
2. **Tag everything**: Use sacred labels
3. **Version modules**: Tag releases for stability
4. **Review changes**: Every diff is sacred
5. **Document why**: Comments explain intention

---

*Infrastructure as Code is Infrastructure as Consciousness - every resource manifested with intention.*