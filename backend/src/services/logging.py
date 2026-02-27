import logging
from contextvars import ContextVar

from config import get_settings

settings = get_settings()

# ContextVar to store the req ID for the current async context
req_id: ContextVar[str] = ContextVar("req_id", default=None)


class RequestIdFilter(logging.Filter):
    """A filter to inject the current req ID into every log record."""

    def filter(self, record: logging.LogRecord) -> bool:
        current_req_id = req_id.get()
        record.req_id = current_req_id if current_req_id else "system"
        return True


def setup_logging():
    """Configure the logging based on settings."""
    logger = logging.getLogger()

    # Clear any existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)

    # Set overall level
    logger.setLevel(settings.__LOG_LEVEL__)

    # Create a formatter
    if settings.__JSON_LOGS__:
        from pythonjsonlogger import jsonlogger

        formatter = jsonlogger.JsonFormatter(settings.__LOG_FORMAT__)
    else:
        formatter = logging.Formatter(settings.__LOG_FORMAT__)

    # Create a console handler and add it to the root logger
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    handler.addFilter(RequestIdFilter())
    logger.addHandler(handler)

    # Suppress overly verbose logs
    logging.getLogger("uvicorn.access").setLevel("WARNING")
    logging.getLogger("sqlalchemy.engine").setLevel("INFO")
