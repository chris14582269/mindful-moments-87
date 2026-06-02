from sqlalchemy.orm import Session

from app.db.models import AuditAction, AuditLog, User


def write_audit_log(
    db: Session,
    *,
    action: AuditAction,
    resource_type: str,
    actor: User | None = None,
    resource_id: str | None = None,
    metadata: dict | None = None,
) -> None:
    db.add(
        AuditLog(
            actor_user_id=actor.id if actor else None,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            metadata_json=metadata,
        )
    )
