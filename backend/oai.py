import base64
import os
from openai import OpenAI, beta
from pydantic import BaseModel
import pprint

client = OpenAI()
client.api_key = os.getenv("OPENAI_API_KEY")

class GroceryItem(BaseModel):
    name: str
    price: float
    quantity: int
    pricePerUnit: float

class GroceryList(BaseModel):
    items: list[GroceryItem]

def process_receipt_oai(image_bytes: bytes) -> GroceryList:
    # Convert image bytes to a base64 string
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    system_prompt = """
        "Please analyze the following receipt image and return a structured JSON array of grocery items. Each item should include:

        1. `name`: the product name.
        2. `price`: the total price of the item.
        3. `quantity`: the quantity of the item (if no quantity is listed, use 1 as the default).
        4. `pricePerUnit`: the price per unit (include this only if specified on the receipt; omit otherwise).
    """

    # Generate API response
    response = beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": system_prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}},
                ],
            }
        ],
        response_format=GroceryList,
    )

    # Return the parsed response
    return response.choices[0].message.parsed

# Example usage
# with open("processed_image.jpg", "rb") as image_file:
#     image_bytes = image_file.read()
#     parsed_response = process_receipt(image_bytes)
#     pprint.pp(parsed_response)
