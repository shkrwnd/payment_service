from fastapi import status
from .base import NavoutPaymentsException


class ValidationError(NavoutPaymentsException):
    def __init__(self, detail: str):
        super().__init__(detail=detail, status_code=status.HTTP_400_BAD_REQUEST)
