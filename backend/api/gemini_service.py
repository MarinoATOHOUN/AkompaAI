import os
import json
from pathlib import Path
from google import genai
from google.genai import types
from django.conf import settings

class GeminiService:
    def __init__(self):
        # Try to load from environment first
        self.api_key = os.environ.get("GEMINI_API_KEY")
        
        # If not in environment, try loading from .env file directly
        if not self.api_key:
            env_path = Path(__file__).resolve().parent.parent / '.env'
            if env_path.exists():
                with open(env_path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if line.startswith('GEMINI_API_KEY='):
                            self.api_key = line.split('=', 1)[1].strip()
                            break
        
        if not self.api_key or self.api_key == 'your-gemini-api-key-here':
            raise ValueError("GEMINI_API_KEY not found or invalid. Please set it in backend/.env file")
        
        self.client = genai.Client(api_key=self.api_key)
        # Use free tier model with generous quotas
        self.model = "gemini-1.5-flash"  # Free tier: 15 RPM, 1M tokens/day

    def process_voice_command(self, audio_bytes, mime_type="audio/mp3"):
        """
        Process audio bytes to extract transaction details.
        Returns a dictionary with transcription and structured data.
        """
        
        prompt = """
        You are an AI assistant for a financial app called Akompta.
        Your task is to listen to the user's voice command and extract transaction details.
        
        The user might say things like:
        - "J'ai vendu la tomate pour 500FCFA le Kilo" (Income)
        - "J'ai payé un ordinateur à 300000FCFA" (Expense)
        
        Please perform the following:
        1. Transcribe the audio exactly as spoken (in French).
        2. Analyze the intent and extract structured data.
        
        Return ONLY a JSON object with the following structure:
        {
            "transcription": "The exact transcription",
            "intent": "create_transaction",
            "data": {
                "type": "income" or "expense",
                "amount": number (e.g. 500),
                "currency": "FCFA" or other,
                "category": "Category name (e.g. Vente, Alimentation, Transport, Technologie)",
                "name": "Description of the item or service",
                "date": "YYYY-MM-DD" or null if not specified (assume today if null)
            }
        }
        
        If the audio is not clear or not related to a transaction, return:
        {
            "transcription": "...",
            "intent": "unknown",
            "error": "Reason"
        }
        """

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    types.Content(
                        parts=[
                            types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                            types.Part.from_text(text=prompt)
                        ]
                    )
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            result = json.loads(response.text)
            return result

        except Exception as e:
            print(f"Error calling Gemini: {e}")
            return {
                "transcription": "",
                "intent": "error",
                "error": str(e)
            }
