# app/services/openai_client.py

from openai import AsyncOpenAI
from typing import Optional, Dict, Any
from config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)


class OpenAIClient:
    """
    Production-ready OpenAI client wrapper.
    Handles secure communication with OpenAI models.
    """

    def __init__(self):
        self._client = AsyncOpenAI(
            api_key=settings.__OPENAI_API_KEY__,
            timeout=30.0
        )

    async def generate_response(
        self,
        prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1000,
        system_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Sends prompt to OpenAI model and returns structured response.
        """

        try:
            response = await self._client.chat.completions.create(
                model=model or settings.__OPENAI_MODEL_ID__,
                messages=[
                    {"role": "system", "content": system_message or "You are a Product Manager having more than 10 years of experience in product management and have worked on multiple successful products. You are also a good communicator and can explain complex ideas in simple terms. You are also a good listener and can understand the problem and provide a solution."},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=temperature,
                max_completion_tokens=max_tokens
            )

            return {
                "content": response.choices[0].message.content,
                "usage": response.usage.model_dump() if response.usage else None,
                "model": response.model
            }

        except Exception as e:
            logger.exception("OpenAI API call failed")
            raise RuntimeError("AI service unavailable") from e