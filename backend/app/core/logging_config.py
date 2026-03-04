import logging
import sys
from pathlib import Path
from ..config import settings


def setup_logging():
    log_level = getattr(settings, "log_level", "INFO").upper()
    formatter = logging.Formatter(
        fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handlers = [logging.StreamHandler(sys.stdout)]
    log_file = getattr(settings, "log_file", None)
    if log_file:
        Path(log_file).parent.mkdir(parents=True, exist_ok=True)
        from logging.handlers import RotatingFileHandler
        fh = RotatingFileHandler(log_file, maxBytes=10 * 1024 * 1024, backupCount=5, encoding="utf-8")
        fh.setFormatter(formatter)
        handlers.append(fh)
    logging.basicConfig(level=getattr(logging, log_level, logging.INFO), handlers=handlers)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
