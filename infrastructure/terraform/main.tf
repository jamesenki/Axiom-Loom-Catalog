# Main Terraform configuration for AI Predictive Maintenance Engine

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }
  
  backend "s3" {
    bucket         = "ai-pm-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "ai-pm-terraform-locks"
  }
}

# Provider configurations
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "AI-Predictive-Maintenance-Engine"
      Environment = var.environment
      ManagedBy   = "Terraform"
      CostCenter  = var.cost_center
    }
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args = [
      "eks",
      "get-token",
      "--cluster-name",
      module.eks.cluster_name
    ]
  }
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args = [
        "eks",
        "get-token",
        "--cluster-name",
        module.eks.cluster_name
      ]
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Local variables
locals {
  name_prefix = "ai-pm-${var.environment}"
  
  common_tags = {
    Project     = "AI-Predictive-Maintenance-Engine"
    Environment = var.environment
    Region      = var.aws_region
  }
  
  azs = slice(data.aws_availability_zones.available.names, 0, 3)
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  name_prefix         = local.name_prefix
  cidr_block          = var.vpc_cidr
  availability_zones  = local.azs
  
  # Subnet configuration
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  database_subnet_cidrs = var.database_subnet_cidrs
  
  # NAT Gateway configuration
  enable_nat_gateway = true
  single_nat_gateway = var.environment != "production"
  
  # VPC Flow Logs
  enable_flow_logs = true
  flow_logs_destination = "s3"
  flow_logs_bucket_arn = module.s3_logs.bucket_arn
  
  tags = local.common_tags
}

# EKS Cluster Module
module "eks" {
  source = "./modules/eks"
  
  cluster_name    = "${local.name_prefix}-cluster"
  cluster_version = var.eks_cluster_version
  
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  
  # Node group configuration
  node_groups = {
    general = {
      desired_size = 3
      min_size     = 3
      max_size     = 10
      
      instance_types = ["t3.xlarge"]
      
      labels = {
        role = "general"
      }
    }
    
    compute = {
      desired_size = 2
      min_size     = 2
      max_size     = 8
      
      instance_types = ["c5.2xlarge"]
      
      labels = {
        role = "compute"
        workload = "ai-prediction"
      }
      
      taints = [
        {
          key    = "workload"
          value  = "ai-prediction"
          effect = "NO_SCHEDULE"
        }
      ]
    }
  }
  
  # IRSA roles
  enable_irsa = true
  
  # Cluster addons
  cluster_addons = {
    coredns = {
      addon_version = "v1.10.1-eksbuild.1"
    }
    kube-proxy = {
      addon_version = "v1.28.1-eksbuild.1"
    }
    vpc-cni = {
      addon_version = "v1.14.1-eksbuild.1"
      configuration_values = jsonencode({
        enableNetworkPolicy = "true"
      })
    }
    aws-ebs-csi-driver = {
      addon_version = "v1.23.1-eksbuild.1"
    }
  }
  
  tags = local.common_tags
}

# RDS Module (PostgreSQL)
module "rds" {
  source = "./modules/rds"
  
  identifier = "${local.name_prefix}-postgres"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.rds_instance_class
  
  allocated_storage     = 100
  max_allocated_storage = 500
  storage_encrypted     = true
  
  database_name = "ai_pm_engine"
  username      = "postgres"
  
  vpc_id                  = module.vpc.vpc_id
  subnet_ids              = module.vpc.database_subnet_ids
  allowed_security_groups = [module.eks.cluster_security_group_id]
  
  # Backup configuration
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  # Multi-AZ for production
  multi_az = var.environment == "production"
  
  # Performance Insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7
  
  tags = local.common_tags
}

# ElastiCache Module (Redis)
module "elasticache" {
  source = "./modules/elasticache"
  
  cluster_id = "${local.name_prefix}-redis"
  
  engine         = "redis"
  engine_version = "7.0"
  node_type      = var.redis_node_type
  num_cache_nodes = var.environment == "production" ? 3 : 1
  
  vpc_id                  = module.vpc.vpc_id
  subnet_ids              = module.vpc.private_subnet_ids
  allowed_security_groups = [module.eks.cluster_security_group_id]
  
  # Redis configuration
  parameter_group_family = "redis7"
  
  # Automatic failover for production
  automatic_failover_enabled = var.environment == "production"
  
  # Backup configuration
  snapshot_retention_limit = 7
  snapshot_window         = "03:00-05:00"
  
  tags = local.common_tags
}

# S3 Buckets
module "s3_data" {
  source = "./modules/s3"
  
  bucket_name = "${local.name_prefix}-data"
  
  # Versioning
  versioning_enabled = true
  
  # Lifecycle rules
  lifecycle_rules = [
    {
      id      = "archive-old-data"
      enabled = true
      
      transition = [
        {
          days          = 90
          storage_class = "STANDARD_IA"
        },
        {
          days          = 180
          storage_class = "GLACIER"
        }
      ]
    }
  ]
  
  # Server-side encryption
  encryption_enabled = true
  
  tags = local.common_tags
}

module "s3_models" {
  source = "./modules/s3"
  
  bucket_name = "${local.name_prefix}-ml-models"
  
  # Versioning for model artifacts
  versioning_enabled = true
  
  # Replication for production
  replication_enabled = var.environment == "production"
  replication_region  = "us-west-2"
  
  tags = local.common_tags
}

module "s3_logs" {
  source = "./modules/s3"
  
  bucket_name = "${local.name_prefix}-logs"
  
  # Lifecycle rules for logs
  lifecycle_rules = [
    {
      id      = "delete-old-logs"
      enabled = true
      
      expiration = {
        days = 90
      }
    }
  ]
  
  # Log delivery configuration
  is_log_bucket = true
  
  tags = local.common_tags
}

# MSK (Kafka) Cluster
module "msk" {
  source = "./modules/msk"
  
  cluster_name = "${local.name_prefix}-kafka"
  kafka_version = "3.5.1"
  
  number_of_broker_nodes = var.environment == "production" ? 3 : 1
  instance_type = var.kafka_instance_type
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
  
  # EBS storage
  ebs_volume_size = 1000
  
  # Encryption
  encryption_in_transit_client_broker = "TLS"
  encryption_in_transit_in_cluster    = true
  
  # Monitoring
  enhanced_monitoring = "PER_TOPIC_PER_BROKER"
  
  # Auto scaling
  auto_scaling_enabled = true
  auto_scaling_max_capacity = 3072
  auto_scaling_target_info = {
    metric_type = "BrokerStorageUtilization"
    target_value = 70
  }
  
  tags = local.common_tags
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"
  
  name = "${local.name_prefix}-alb"
  
  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.public_subnet_ids
  
  # SSL configuration
  certificate_arn = var.certificate_arn
  
  # Target groups will be created by Kubernetes Ingress
  
  # WAF
  enable_waf = var.environment == "production"
  
  tags = local.common_tags
}

# Route53
module "route53" {
  source = "./modules/route53"
  
  domain_name = var.domain_name
  
  # Records
  records = [
    {
      name    = "api"
      type    = "A"
      alias   = {
        name                   = module.alb.dns_name
        zone_id                = module.alb.zone_id
        evaluate_target_health = true
      }
    },
    {
      name    = "grpc"
      type    = "A"
      alias   = {
        name                   = module.alb.dns_name
        zone_id                = module.alb.zone_id
        evaluate_target_health = true
      }
    },
    {
      name    = "ws"
      type    = "A"
      alias   = {
        name                   = module.alb.dns_name
        zone_id                = module.alb.zone_id
        evaluate_target_health = true
      }
    }
  ]
  
  tags = local.common_tags
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "application_logs" {
  name              = "/aws/eks/${local.name_prefix}/application"
  retention_in_days = 30
  
  tags = local.common_tags
}

# Outputs
output "eks_cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = module.elasticache.endpoint
  sensitive   = true
}

output "msk_bootstrap_servers" {
  description = "MSK cluster bootstrap servers"
  value       = module.msk.bootstrap_servers
  sensitive   = true
}

output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = module.alb.dns_name
}