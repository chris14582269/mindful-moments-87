from celery import Celery

from app.core.config import get_settings

settings = get_settings()
celery_app = Celery("food_ai", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.task_routes = {"app.worker.analyse_meal_task": {"queue": "ai-analysis"}}


@celery_app.task(name="app.worker.analyse_meal_task")
def analyse_meal_task(meal_id: str) -> dict[str, str]:
    # Production workers fetch the meal, invoke AI, persist results, and emit metrics.
    return {"meal_id": meal_id, "status": "queued"}
