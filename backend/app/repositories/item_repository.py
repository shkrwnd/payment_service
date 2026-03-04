from sqlalchemy.orm import Session
from ..models import Item
from .base import BaseRepository


class ItemRepository(BaseRepository[Item]):
    def __init__(self, db: Session):
        super().__init__(Item, db)
