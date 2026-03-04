from fastapi import APIRouter, Depends, status
from typing import List
from ...schemas import ItemCreate, ItemUpdate, ItemResponse
from ...services import ItemService
from ..dependencies import get_item_service

router = APIRouter(prefix="/items", tags=["items"])


@router.get("", response_model=List[ItemResponse])
def list_items(
    skip: int = 0,
    limit: int = 100,
    item_service: ItemService = Depends(get_item_service),
):
    return item_service.list_items(skip=skip, limit=limit)


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, item_service: ItemService = Depends(get_item_service)):
    return item_service.get_item(item_id)


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    data: ItemCreate,
    item_service: ItemService = Depends(get_item_service),
):
    return item_service.create_item(data)


@router.put("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    data: ItemUpdate,
    item_service: ItemService = Depends(get_item_service),
):
    return item_service.update_item(item_id, data)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: int,
    item_service: ItemService = Depends(get_item_service),
):
    item_service.delete_item(item_id)
