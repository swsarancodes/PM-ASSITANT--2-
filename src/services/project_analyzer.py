# app/services/project_analyzer.py

import json
from services.openai_client import OpenAIClient
from services.prompt_reader import PromptReader


class ProjectAnalyzer:

    def __init__(self):
        self.openai_client = OpenAIClient()
        self.prompt_reader = PromptReader("prompts/project_analysis.yaml")

    async def analyze_project(self, ppt_text: str) -> dict:

        formatted_prompt = self.prompt_reader.get_prompt(
            "project_analysis",
            ppt_text=ppt_text
        )

        response = await self.openai_client.generate_response(
            prompt=formatted_prompt,
            temperature=0.2,
            max_tokens=3000,
            system_message="You are an expert system architect."
        )

        print(response, "-----------response")

        # Strict JSON enforcement
        try:
            parsed = json.loads(response["content"])
        except Exception as e:
            raise str(e)

        return parsed