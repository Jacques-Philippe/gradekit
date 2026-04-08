from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from auth.security import get_current_user
from database import get_db
from models.activity import Activity
from models.activity_type import ActivityType
from models.user import User
from pydantic import BaseModel
from datetime import datetime


class ActivityResponse(BaseModel):
    id: int
    event_type: ActivityType
    payload: str
    created_at: datetime


router = APIRouter(prefix="/activity")


@router.get("", response_model=list[ActivityResponse])
def list_activity(
    event_type: ActivityType | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Activity).filter(Activity.user_id == current_user.id)
    if event_type is not None:
        query = query.filter(Activity.event_type == event_type)
    events = query.order_by(Activity.created_at.desc()).limit(20).all()
    return [
        ActivityResponse(
            id=e.id,
            event_type=e.event_type,
            payload=e.payload,
            created_at=e.created_at,
        )
        for e in events
    ]
