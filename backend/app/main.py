from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from .core.database import init_db
from .core.logging_config import setup_logging
from .api.routes import auth, items
from .api.exceptions import (
    navout_payments_exception_handler,
    validation_exception_handler,
    general_exception_handler,
)
from .exceptions import NavoutPaymentsException
from .config import settings

setup_logging()

app = FastAPI(title="Navout Payments API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(NavoutPaymentsException, navout_payments_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

init_db()

app.include_router(auth.router, prefix="/api")
app.include_router(items.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Navout Payments API"}


@app.get("/health")
def health():
    return {"status": "healthy"}
