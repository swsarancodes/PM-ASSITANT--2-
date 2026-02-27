import json
import logging
import os
from functools import lru_cache

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)

load_dotenv()


class Settings(BaseSettings):
    # Environment configuration
    __ENVIRONMENT__: str = os.getenv("ENVIRONMENT", "dev").lower()

    # PostgreSQL configuration
    __POSTGRES_USER__: str = ""
    __POSTGRES_PASSWORD__: str = ""
    __POSTGRES_HOST__: str = ""
    __POSTGRES_PORT__: str = ""
    __POSTGRES_DB__: str = ""
    __POSTGRES_DB_URL__: str = ""

    # AWS Bedrock configuration
    __AWS_REGION__: str = os.getenv("AWS_REGION", "ap-south-1")
    __OPENAI_API_KEY__: str = ""
    __OPENAI_MODEL_ID__: str = ""

    # HTTP Client configuration
    __HTTPX_TIMEOUT__: int = 30

    # Logging configuration
    __LOG_LEVEL__: str = "INFO"
    __LOG_FORMAT__: str = "%(asctime)s - %(name)s - %(levelname)s - [%(req_id)s] - %(message)s"
    __JSON_LOGS__: bool = os.getenv("JSON_LOGS", False)
    ##Dev AWS Keys
    __AWS_ACCESS_KEY_ID__: str = ""
    __AWS_SECRET_ACCESS_KEY__: str = ""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._secrets_manager_client = None
        self._load_config()

    def _load_config(self):
        """Load configuration based on environment"""
        if self.__ENVIRONMENT__ == "prod" and self.__SECRETS_MANAGER_ENABLED__:
            self._load_from_secrets_manager()
        else:
            self._load_from_env()
        # Post-process configuration
        self._post_process_config()

    def _load_from_env(self):
        """Load configuration from environment variables"""
        print("Loading configuration from environment variables")

        # PostgreSQL configuration
        self.__POSTGRES_USER__ = os.getenv("POSTGRES_USER")
        self.__POSTGRES_PASSWORD__ = os.getenv("POSTGRES_PASSWORD")
        self.__POSTGRES_HOST__ = os.getenv("POSTGRES_HOST", "localhost")
        self.__POSTGRES_PORT__ = os.getenv("POSTGRES_PORT")
        self.__POSTGRES_DB__ = os.getenv("POSTGRES_DB")

        # AWS Bedrock configuration
        self.__AWS_REGION__ = os.getenv("AWS_REGION", "ap-south-1")
        self.__OPENAI_API_KEY__ = os.getenv("OPENAI_API_KEY")
        self.__OPENAI_MODEL_ID__ = os.getenv("OPENAI_MODEL_ID")

        # HTTP Client configuration
        self.__HTTPX_TIMEOUT__ = int(os.getenv("HTTPX_TIMEOUT", "30"))

        # Logging configuration
        self.__LOG_LEVEL__ = os.getenv("LOG_LEVEL", "INFO").upper()
        self.__LOG_FORMAT__ = os.getenv(
            "LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - [%(req_id)s] - %(message)s"
        )
        self.__JSON_LOGS__ = os.getenv("JSON_LOGS", "0").lower() in ["1", "true", "yes"]

        # AWS credentials
        self.__AWS_ACCESS_KEY_ID__ = os.getenv("AWS_ACCESS_KEY_ID")
        self.__AWS_SECRET_ACCESS_KEY__ = os.getenv("AWS_SECRET_ACCESS_KEY")

    def _load_from_secrets_manager(self):
        """Load configuration from AWS Secrets Manager"""
        print("Loading configuration from AWS Secrets Manager")
        try:
            if not self._secrets_manager_client:
                self._secrets_manager_client = boto3.client(
                    "secretsmanager",
                    region_name=self.__SECRETS_MANAGER_REGION__,
                    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                )

            secret_value = self._secrets_manager_client.get_secret_value(SecretId=self.__SECRETS_MANAGER_SECRET_NAME__)
            secret_data = json.loads(secret_value["SecretString"])

            # Update settings from secrets manager
            for key, value in secret_data.items():
                if hasattr(self, "__" + key.upper() + "__"):
                    setattr(self, "__" + key.upper() + "__", value)
                elif hasattr(self, "__" + key + "__"):
                    setattr(self, "__" + key + "__", value)

            print("Configuration loaded successfully from Secrets Manager")

        except (ClientError, BotoCoreError, json.JSONDecodeError) as e:
            ## fallback in-case of failure
            logger.warning(f"Failed to load from Secrets Manager, falling back to environment: {e}")
            self._load_from_env()

    def _validate_prod_env(self):
        """Validate production environment"""
        if self.__ENVIRONMENT__ == "prod" and self.__SECRETS_MANAGER_ENABLED__:
            valid_keys = [
                '__POSTGRES_USER__',
                '__POSTGRES_PASSWORD__',
                '__POSTGRES_HOST__',
                '__POSTGRES_PORT__',
                '__POSTGRES_DB__',
                '__OPENAI_API_KEY__',
                '__OPENAI_MODEL_ID__',
            ]

            missing_fields = []
            for key in valid_keys:
                if not getattr(self, key):
                    missing_fields.append(key)

            if missing_fields:
                logger.warning(f"Missing required production configuration: {missing_fields}")
                raise ValueError("Missing required environment variables.")

    def _post_process_config(self):
        """Post-process configuration"""

        ## valid keys for prod
        if self.__ENVIRONMENT__ == "prod":
            self._validate_prod_env()

        ## build db url
        if not self.__POSTGRES_DB_URL__ and all(
            [
                self.__POSTGRES_USER__,
                self.__POSTGRES_PASSWORD__,
                self.__POSTGRES_HOST__,
                self.__POSTGRES_PORT__,
                self.__POSTGRES_DB__,
            ]
        ):
            self.__POSTGRES_DB_URL__ = f"postgresql+asyncpg://{self.__POSTGRES_USER__}:{self.__POSTGRES_PASSWORD__}@{self.__POSTGRES_HOST__}:{self.__POSTGRES_PORT__}/{self.__POSTGRES_DB__}"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
