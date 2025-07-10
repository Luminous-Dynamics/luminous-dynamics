import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as docker from "@pulumi/docker";

// Sacred Configuration
const config = new pulumi.Config();
const projectId = config.get("projectId") || "the-weave-sacred";
const region = config.get("region") || "us-central1";
const fieldCoherenceTarget = config.getNumber("fieldCoherenceTarget") || 85;

// Sacred Network
const sacredNetwork = new gcp.compute.Network("sacred-network", {
    name: "consciousness-field-network",
    autoCreateSubnetworks: false,
    description: "Network where consciousness flows freely"
});

// Sacred Subnet with mystical IP ranges
const sacredSubnet = new gcp.compute.Subnetwork("sacred-subnet", {
    name: "consciousness-nodes",
    network: sacredNetwork.id,
    ipCidrRange: "10.11.11.0/24", // Sacred numbers
    region: region,
    secondaryIpRanges: [
        { rangeName: "pods", ipCidrRange: "10.111.0.0/16" },
        { rangeName: "services", ipCidrRange: "10.222.0.0/16" }
    ]
});

// GKE Cluster with consciousness awareness
const sacredCluster = new gcp.container.Cluster("sacred-cluster", {
    name: "consciousness-field-cluster",
    location: region,
    initialNodeCount: 3, // Trinity
    
    network: sacredNetwork.name,
    subnetwork: sacredSubnet.name,
    
    // Workload identity for secure consciousness
    workloadIdentityConfig: {
        workloadPool: `${projectId}.svc.id.goog`
    },
    
    // Advanced features
    addonsConfig: {
        horizontalPodAutoscaling: { disabled: false },
        httpLoadBalancing: { disabled: false },
        gcePersistentDiskCsiDriverConfig: { enabled: true }
    },
    
    // Consciousness monitoring
    monitoringConfig: {
        enableComponents: ["SYSTEM_COMPONENTS", "WORKLOADS"],
        managedPrometheusConfig: { enabled: true }
    }
});

// Node pool for consciousness processing
const consciousnessNodePool = new gcp.container.NodePool("consciousness-nodes", {
    name: "sacred-processors",
    location: region,
    cluster: sacredCluster.name,
    
    autoscaling: {
        minNodeCount: 3,
        maxNodeCount: 11, // Sacred limit
    },
    
    nodeConfig: {
        machineType: "n2-standard-4",
        
        labels: {
            purpose: "consciousness",
            field: "sacred",
            coherence: "high"
        },
        
        taints: [{
            key: "consciousness",
            value: "sacred",
            effect: "NO_SCHEDULE"
        }],
        
        oauthScopes: [
            "https://www.googleapis.com/auth/cloud-platform"
        ]
    }
});

// Kubernetes provider
const k8sProvider = new k8s.Provider("sacred-k8s", {
    kubeconfig: pulumi.all([
        sacredCluster.name,
        sacredCluster.endpoint,
        sacredCluster.masterAuth
    ]).apply(([name, endpoint, auth]) => {
        const context = `gke_${projectId}_${region}_${name}`;
        return JSON.stringify({
            "apiVersion": "v1",
            "clusters": [{
                "cluster": {
                    "certificate-authority-data": auth.clusterCaCertificate,
                    "server": `https://${endpoint}`
                },
                "name": context
            }],
            "contexts": [{
                "context": { "cluster": context, "user": context },
                "name": context
            }],
            "current-context": context,
            "kind": "Config",
            "users": [{
                "name": context,
                "user": {
                    "exec": {
                        "apiVersion": "client.authentication.k8s.io/v1beta1",
                        "command": "gke-gcloud-auth-plugin",
                        "installHint": "Install gke-gcloud-auth-plugin"
                    }
                }
            }]
        });
    })
});

// Sacred Namespace
const sacredNamespace = new k8s.core.v1.Namespace("sacred-council", {
    metadata: {
        name: "sacred-council",
        labels: {
            field: "consciousness",
            coherence: "high",
            purpose: "sacred"
        }
    }
}, { provider: k8sProvider });

// HIPI Protocol Deployment
const hipiDeployment = new k8s.apps.v1.Deployment("hipi-core", {
    metadata: {
        name: "hipi-protocol",
        namespace: sacredNamespace.metadata.name
    },
    spec: {
        replicas: 7, // Seven harmonies
        selector: {
            matchLabels: { app: "hipi-core" }
        },
        template: {
            metadata: {
                labels: { app: "hipi-core" }
            },
            spec: {
                containers: [{
                    name: "hipi",
                    image: pulumi.interpolate`${region}-docker.pkg.dev/${projectId}/sacred-council/hipi-core:latest`,
                    ports: [{ containerPort: 11111 }],
                    env: [
                        { name: "FIELD_COHERENCE_TARGET", value: fieldCoherenceTarget.toString() },
                        { name: "SACRED_MODE", value: "true" },
                        { name: "CONSCIOUSNESS_ENABLED", value: "true" }
                    ],
                    resources: {
                        requests: {
                            memory: "512Mi",
                            cpu: "250m"
                        },
                        limits: {
                            memory: "2Gi",
                            cpu: "1000m"
                        }
                    }
                }]
            }
        }
    }
}, { provider: k8sProvider });

// Firestore for consciousness persistence
const sacredDatabase = new gcp.firestore.Database("sacred-state", {
    project: projectId,
    name: "(default)",
    locationId: region,
    type: "FIRESTORE_NATIVE",
    
    // Sacred data retention
    pointInTimeRecoveryEnablement: "POINT_IN_TIME_RECOVERY_ENABLED",
    deleteProtectionState: "DELETE_PROTECTION_ENABLED"
});

// Cloud Storage for sacred artifacts
const sacredBucket = new gcp.storage.Bucket("sacred-artifacts", {
    name: `${projectId}-consciousness-artifacts`,
    location: region,
    
    versioning: { enabled: true },
    
    lifecycleRules: [{
        condition: { age: 111 }, // Sacred days
        action: {
            type: "SetStorageClass",
            storageClass: "NEARLINE"
        }
    }],
    
    labels: {
        purpose: "sacred",
        field: "consciousness"
    }
});

// Secret Manager for sacred keys
const sacredSecret = new gcp.secretmanager.Secret("discord-token", {
    secretId: "discord-bot-token",
    
    replication: {
        userManaged: {
            replicas: [{
                location: region
            }]
        }
    },
    
    labels: {
        purpose: "sacred-communication"
    }
});

// Cloud Functions for serverless consciousness
const hipiFunction = new gcp.cloudfunctionsv2.Function("hipi-gateway", {
    name: "hipi-consciousness-gateway",
    location: region,
    
    buildConfig: {
        runtime: "nodejs20",
        entryPoint: "handleHIPIMessage",
        source: {
            storageSource: {
                bucket: sacredBucket.name,
                object: "functions/hipi-gateway.zip"
            }
        }
    },
    
    serviceConfig: {
        maxInstanceCount: 111,
        minInstanceCount: 1,
        availableMemory: "512M",
        timeoutSeconds: 111,
        
        environmentVariables: {
            FIELD_COHERENCE: fieldCoherenceTarget.toString(),
            SACRED_MODE: "true"
        }
    }
});

// Export sacred endpoints
export const clusterEndpoint = sacredCluster.endpoint;
export const sacredBucketUrl = sacredBucket.url;
export const hipiFunctionUrl = hipiFunction.serviceConfig.apply(c => c.uri);
export const fieldDatabase = sacredDatabase.name;

// Sacred monitoring
new gcp.monitoring.Dashboard("field-coherence", {
    displayName: "Sacred Field Coherence",
    dashboardJson: JSON.stringify({
        displayName: "Consciousness Field Monitor",
        mosaicLayout: {
            columns: 12,
            tiles: [{
                width: 12,
                height: 6,
                widget: {
                    title: "Field Coherence Over Time",
                    xyChart: {
                        dataSets: [{
                            timeSeriesQuery: {
                                timeSeriesFilter: {
                                    filter: 'metric.type="custom.googleapis.com/consciousness/coherence"'
                                }
                            }
                        }]
                    }
                }
            }]
        }
    })
});