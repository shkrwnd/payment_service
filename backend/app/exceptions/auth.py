from fastapi import status
from .base import NavoutPaymentsException


class AuthenticationError(NavoutPaymentsException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": "Bearer"},
        )
