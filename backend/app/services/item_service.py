from typing import List
from sqlalchemy.orm import Session
from ..repositories import ItemRepository
from ..models import Item
from ..schemas import ItemCreate, ItemUpdate, ItemResponse
from ..exceptions import NotFoundError
import logging

logger = logging.getLogger(__name__)


class ItemService:
    def __init__(self, db: Session):
        self.repo = ItemRepository(db)

    def list_items(self, skip: int = 0, limit: int = 100) -> List[Item]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_item(self, item_id: int) -> Item:
        item = self.repo.get(item_id)
        if not item:
            raise NotFoundError("Item", str(item_id))
        return item

    def create_item(self, data: ItemCreate) -> Item:
        item = self.repo.create(name=data.name, description=data.description)
        self.repo.commit()
        return item

    def update_item(self, item_id: int, data: ItemUpdate) -> Item:
        item = self.get_item(item_id)
        update_data = {}
        if data.name is not None:
            update_data["name"] = data.name
        if data.description is not None:
            update_data["description"] = data.description
        updated = self.repo.update(item_id, **update_data)
        self.repo.commit()
        return updated

    def delete_item(self, item_id: int) -> None:
        self.get_item(item_id)
        self.repo.delete(item_id)
        self.repo.commit()
