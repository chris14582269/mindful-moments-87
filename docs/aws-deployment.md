# AWS Singapore Deployment

## Prerequisites

- AWS account with access to `ap-southeast-1`.
- ECR repositories for frontend and backend images.
- Terraform >= 1.6.
- Secrets available through GitHub Actions or AWS Secrets Manager:
  - `OPENAI_API_KEY`
  - `JWT_SECRET_KEY`
  - `DATABASE_PASSWORD`
  - `WHATSAPP_ACCESS_TOKEN`
  - `WHATSAPP_VERIFY_TOKEN`

## Build and push images

```bash
docker build -t food-ai-frontend:latest .
docker build -t food-ai-backend:latest -f backend/Dockerfile .
```

Tag and push both images to ECR, then pass their image URIs to Terraform.

## Provision infrastructure

```bash
cd terraform
terraform init
terraform plan \
  -var='container_image_frontend=<account>.dkr.ecr.ap-southeast-1.amazonaws.com/food-ai-frontend:latest' \
  -var='container_image_backend=<account>.dkr.ecr.ap-southeast-1.amazonaws.com/food-ai-backend:latest' \
  -var='database_password=<strong password>'
terraform apply
```

## Runtime hardening checklist

- Store secrets in AWS Secrets Manager and inject them into ECS task definitions.
- Enable WAF on CloudFront and configure strict security headers.
- Configure RDS automated backups, deletion protection, and point-in-time recovery.
- Use private subnets for ECS tasks, RDS, and ElastiCache; expose only ALB/CloudFront.
- Export OpenTelemetry traces and metrics to CloudWatch/Grafana.
- Review PDPA consent flows and data retention policies with legal/compliance teams.
