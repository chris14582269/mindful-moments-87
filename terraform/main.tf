data "aws_availability_zones" "available" {}

data "aws_caller_identity" "current" {}

locals {
  name = var.project_name
  azs  = slice(data.aws_availability_zones.available.names, 0, 2)
}

resource "aws_kms_key" "main" {
  description             = "${local.name} encryption key"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}

resource "aws_s3_bucket" "meal_images" {
  bucket = "${local.name}-meal-images-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "meal_images" {
  bucket = aws_s3_bucket.meal_images.id
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.main.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "meal_images" {
  bucket                  = aws_s3_bucket.meal_images.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_vpc" "main" {
  cidr_block           = "10.42.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = local.name }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true
  tags = { Name = "${local.name}-public-${count.index}" }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 10)
  availability_zone = local.azs[count.index]
  tags = { Name = "${local.name}-private-${count.index}" }
}

resource "aws_db_subnet_group" "main" {
  name       = local.name
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_security_group" "app" {
  name   = "${local.name}-app"
  vpc_id = aws_vpc.main.id
  ingress { from_port = 443, to_port = 443, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }
  egress { from_port = 0, to_port = 0, protocol = "-1", cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_db_instance" "postgres" {
  identifier             = local.name
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = "db.t4g.medium"
  allocated_storage      = 50
  db_name                = "food_ai"
  username               = var.database_username
  password               = var.database_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  storage_encrypted      = true
  kms_key_id             = aws_kms_key.main.arn
  backup_retention_period = 7
  deletion_protection    = true
  skip_final_snapshot    = false
}

resource "aws_elasticache_subnet_group" "main" {
  name       = local.name
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = local.name
  description                = "Food AI Redis queue/cache"
  engine                     = "redis"
  node_type                  = "cache.t4g.small"
  num_cache_clusters         = 2
  automatic_failover_enabled = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  subnet_group_name          = aws_elasticache_subnet_group.main.name
}

resource "aws_ecs_cluster" "main" {
  name = local.name
  setting { name = "containerInsights", value = "enabled" }
}

resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${local.name}"
  retention_in_days = 90
  kms_key_id        = aws_kms_key.main.arn
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${local.name}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  container_definitions = jsonencode([{ name = "backend", image = var.container_image_backend, essential = true, portMappings = [{ containerPort = 8000 }], logConfiguration = { logDriver = "awslogs", options = { awslogs-group = aws_cloudwatch_log_group.app.name, awslogs-region = var.aws_region, awslogs-stream-prefix = "backend" } } }])
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "${local.name}-frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  container_definitions = jsonencode([{ name = "frontend", image = var.container_image_frontend, essential = true, portMappings = [{ containerPort = 3000 }], logConfiguration = { logDriver = "awslogs", options = { awslogs-group = aws_cloudwatch_log_group.app.name, awslogs-region = var.aws_region, awslogs-stream-prefix = "frontend" } } }])
}

resource "aws_iam_role" "ecs_execution" {
  name = "${local.name}-ecs-execution"
  assume_role_policy = jsonencode({ Version = "2012-10-17", Statement = [{ Action = "sts:AssumeRole", Effect = "Allow", Principal = { Service = "ecs-tasks.amazonaws.com" } }] })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
