# app/services/prompt_reader.py

import yaml
from pathlib import Path
from typing import Dict, Any
import threading


class PromptReader:
    """
    Loads prompts from YAML and allows retrieval by name.
    Supports template variable injection.
    """

    _lock = threading.Lock()
    _prompts_cache: Dict[str, Any] = {}

    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self._load_prompts()

    def _load_prompts(self):
        with self._lock:
            if not self._prompts_cache:
                with open(self.file_path, "r", encoding="utf-8") as file:
                    self._prompts_cache = yaml.safe_load(file)

    def get_prompt(self, prompt_name: str, **kwargs) -> str:
        """
        Fetch a prompt by name and format it with variables.
        """

        if prompt_name not in self._prompts_cache:
            raise ValueError(f"Prompt '{prompt_name}' not found.")

        template = self._prompts_cache[prompt_name]

        try:
            return template.format(**kwargs)
        except KeyError as e:
            raise ValueError(f"Missing variable for prompt: {e}")