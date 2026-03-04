from datetime import timedelta
from sqlalchemy.orm import Session
from ..repositories import UserRepository
from ..core.security import get_password_hash, authenticate_user, create_access_token
from ..models import User
from ..schemas import UserRegister, UserLogin, Token
from ..exceptions import ValidationError, AuthenticationError
from ..config import settings
import logging

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
        self.db = db

    def register(self, user_data: UserRegister) -> Token:
        existing = self.user_repo.get_by_email(user_data.email)
        if existing:
            raise ValidationError("Email already registered")
        hashed = get_password_hash(user_data.password)
        new_user = self.user_repo.create(email=user_data.email, hashed_password=hashed)
        self.user_repo.commit()
        expires = timedelta(hours=settings.jwt_expiration_hours)
        access_token = create_access_token(data={"sub": new_user.email}, expires_delta=expires)
        return Token(access_token=access_token, token_type="bearer")

    def login(self, user_data: UserLogin) -> Token:
        user = authenticate_user(self.db, user_data.email, user_data.password)
        if not user:
            raise AuthenticationError("Invalid email or password")
        expires = timedelta(hours=settings.jwt_expiration_hours)
        access_token = create_access_token(data={"sub": user.email}, expires_delta=expires)
        return Token(access_token=access_token, token_type="bearer")
