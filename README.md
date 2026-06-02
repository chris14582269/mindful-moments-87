# Food AI Singapore Platform

Production-oriented scaffold for a Singapore-focused food recognition and nutrition coaching platform. It includes a Next.js 15 frontend, FastAPI backend, PostgreSQL/pgvector schema, Redis/Celery background jobs, WhatsApp webhook integration, Docker Compose, Terraform for AWS Singapore, OpenTelemetry hooks, and CI.

## Capabilities

### Public users

- Upload food photos or submit meal descriptions.
- Receive AI food identification, portion estimates, calories, macros, fibre, sodium, and confidence score.
- Chat with an AI nutrition coach for Singapore-specific swaps.
- Track meal history, weight, daily calories, weekly trends, and HPB Healthy Eating Score.

### Healthcare professionals

- Review patient nutrition records.
- Monitor adherence and Healthy Eating Index trends.
- View risk alerts and generate report-ready summaries.

### Administrators

- Manage users, roles, and permissions.
- Monitor AI usage and system health.
- Review immutable audit logs.

## Tech stack

- **Frontend:** Next.js 15, TypeScript, TailwindCSS, ShadCN UI primitives.
- **Backend:** FastAPI, SQLAlchemy, JWT auth, RBAC, OpenAPI Swagger docs.
- **Data:** PostgreSQL with pgvector, Redis cache/queue.
- **AI:** OpenAI GPT-5.5 and Vision API boundary with structured JSON outputs.
- **Jobs:** Celery with Redis broker.
- **Storage:** S3 in `ap-southeast-1` with server-side encryption.
- **Infra:** Docker, Docker Compose, Terraform, ECS Fargate, RDS, ElastiCache, S3, CloudFront-ready architecture.
- **Monitoring:** CloudWatch, OpenTelemetry, Grafana.

## Project structure

```text
app/                         Next.js app router dashboard
src/components/ui/           ShadCN UI primitives
backend/app/                 FastAPI application
backend/app/api/routes/      REST and webhook routers
backend/app/services/        AI, nutrition, storage, audit services
backend/app/db/              SQLAlchemy models/session
backend/alembic/             Database migrations
backend/tests/               Python tests
docker-compose.yml           Local full-stack services
terraform/                   AWS Singapore infrastructure
docs/                        Architecture, deployment, security notes
.github/workflows/ci.yml     Frontend/backend CI
```

## Local development

### 1. Configure environment

```bash
cp .env.example .env
# Update JWT_SECRET_KEY and API credentials when needed.
```

The backend runs without OpenAI credentials by using deterministic Singapore food fixtures for local development and tests.

### 2. Start with Docker Compose

```bash
docker compose up --build
```

Services:

- Frontend: <http://localhost:3000>
- Backend health: <http://localhost:8000/health>
- Swagger docs: <http://localhost:8000/api/v1/openapi.json> and <http://localhost:8000/docs>
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Grafana: <http://localhost:3001>

### 3. Run separately

Frontend:

```bash
npm ci
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Database migrations:

```bash
cd backend
alembic upgrade head
```

## Core API endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/token`
- `POST /api/v1/meals/analyse-text`
- `POST /api/v1/meals/upload`
- `GET /api/v1/meals/{meal_id}`
- `POST /api/v1/chat`
- `GET /api/v1/dashboards/user`
- `GET /api/v1/dashboards/clinician`
- `GET /api/v1/dashboards/admin`
- `GET|POST /webhooks/whatsapp`

## Food recognition workflow

1. Receive image/text from web or WhatsApp.
2. OpenAI Vision identifies food items, portions, and cooking method.
3. Service maps foods to Singapore food composition references and HPB nutrient guidance.
4. Calculate calories, protein, fat, carbs, fibre, sodium, fruit, vegetables, wholegrains, and sugar.
5. Compute Healthy Eating Score from 0-100 and category: Poor, Fair, Good, Excellent.
6. Persist structured meal, food items, nutrition result, recommendations, chat messages, and audit log.

Example structured output:

```json
{
  "foods": [
    {
      "name": "Chicken Rice",
      "portion": "1 serving",
      "calories": 620,
      "protein": 32,
      "carbs": 72,
      "fat": 18
    }
  ]
}
```

## WhatsApp integration

Configure Meta WhatsApp Business API values in environment variables:

- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`

Expose `/webhooks/whatsapp` through your public API domain. Meta verification uses the GET endpoint; message events use POST. The webhook currently parses text/photo notifications, runs analysis, and sends a text reply when credentials are present.

## Security and compliance

Implemented technical controls include JWT auth, role checks, audit logs, encrypted AWS storage resources, environment-based secrets, and PDPA consent timestamping. See [`docs/security-pdpa.md`](docs/security-pdpa.md) for launch requirements and compliance notes.

## Testing

```bash
npm run test
npm run build
npm run backend:test
```

Backend coverage is configured to fail below 80% for the application code under test.

## AWS deployment

Terraform provisions Singapore-region infrastructure foundations for ECS Fargate, RDS PostgreSQL, ElastiCache Redis, S3, KMS, CloudWatch logs, and networking. See [`docs/aws-deployment.md`](docs/aws-deployment.md).

## Architecture diagram

See [`docs/architecture.md`](docs/architecture.md) for the Mermaid architecture diagram and data flow.
