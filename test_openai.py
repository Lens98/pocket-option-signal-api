import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

try:
    response = client.responses.create(
        model="gpt-5",
        input="Reply with only: API connection successful."
    )

    print(response.output_text)

except Exception as e:
    print("ERROR:")
    print(e)