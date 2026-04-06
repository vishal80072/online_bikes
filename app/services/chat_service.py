import json
from groq import AsyncGroq
from app.config import settings

client = AsyncGroq(api_key=settings.GROQ_API_KEY)

async def get_bike_suggestion(user_message: str, bikes: list) -> str:
    bikes_context = json.dumps(bikes, default=str, indent=2)
    system_prompt = f"""You are BikeBot, an expert bike rental assistant for BikeBook platform.
You help users find the perfect bike based on their requirements.

Here is the current inventory of available bikes:
{bikes_context}

Guidelines:
- Recommend specific bikes from the inventory above
- Mention price per day, category, brand, and key features
- Be conversational, helpful and concise
- If no bikes match, suggest the closest alternatives
- Always format recommendations clearly with bike name, price, and why it fits
- If asked about something unrelated to bikes, politely redirect to bike queries
- Output should be in proper markdown format for better readability
"""

    response = await client.chat.completions.create(
        model="groq/compound-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        max_tokens=512,
        temperature=0.7,
    )
    return response.choices[0].message.content