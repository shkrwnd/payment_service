from fastapi import Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..services import AuthService, ItemService


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)


def get_item_service(db: Session = Depends(get_db)) -> ItemService:
    return ItemService(db)
