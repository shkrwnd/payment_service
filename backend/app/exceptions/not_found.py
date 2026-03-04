from fastapi import status
from .base import NavoutPaymentsException


class NotFoundError(NavoutPaymentsException):
    def __init__(self, resource: str, identifier: str = None):
        detail = f"{resource} not found"
        if identifier:
            detail += f" with id: {identifier}"
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)
