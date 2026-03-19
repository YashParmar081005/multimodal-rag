import os
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "your_openrouter_key_here":
    print("WARNING: OPENROUTER_API_KEY is not configured in the .env file.")
