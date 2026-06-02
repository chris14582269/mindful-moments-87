# Food AI Singapore Architecture

```mermaid
flowchart LR
  User[Public user] --> Next[Next.js 15 web app]
  Clinician[Clinician / Dietitian] --> Next
  Admin[Administrator] --> Next
  WhatsApp[Meta WhatsApp Business API] --> Webhook[/webhooks/whatsapp]
  Next --> API[FastAPI REST API]
  Webhook --> API
  API --> Auth[JWT + RBAC]
  API --> Postgres[(RDS PostgreSQL + pgvector)]
  API --> Redis[(ElastiCache Redis)]
  API --> S3[(S3 ap-southeast-1)]
  API --> OpenAI[OpenAI GPT-5.5 + Vision]
  API --> Celery[Celery workers]
  Celery --> Redis
  Celery --> OpenAI
  API --> CloudWatch[CloudWatch + OpenTelemetry]
  CloudWatch --> Grafana[Grafana]
  CloudFront[CloudFront] --> Next
```

## Data flow

1. A user uploads a meal image or sends a WhatsApp text/photo.
2. FastAPI stores metadata, signs S3 image uploads, and queues analysis if needed.
3. OpenAI Vision identifies food items, portions, and cooking methods using structured JSON.
4. The nutrition service maps results to Singapore reference foods and HPB-style scoring.
5. Results, recommendations, chat history, and audit logs are persisted in PostgreSQL.
6. Dashboards expose role-filtered views for users, clinicians, dietitians, and admins.

## Security controls

- JWT bearer authentication and role-based access control.
- S3, RDS, CloudWatch, and Redis encryption at rest; TLS in transit.
- Audit logs for authentication, AI analysis, clinical access, and webhooks.
- Environment variables and AWS secret managers for all credentials.
- Singapore `ap-southeast-1` deployment target for data residency alignment.
