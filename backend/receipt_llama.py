from langchain_ollama import OllamaLLM
import json
from typing import List, Dict

def load_system_prompt() -> str:
    with open("system_prompt.md", "r") as file:
        return file.read()

def process_invoices(rows: List[str]) -> List[Dict]:
    llm = OllamaLLM(
        model="llama3.2",
        temperature=0.1,
    )
    
    # Create a prompt that explicitly asks for array brackets
    prompt = f"""You are a JSON processing tool. Output ONLY a JSON array with square brackets.
The output must start with '[' and end with ']'.

EXAMPLE CORRECT OUTPUT:
[
    {{"name": "Item1", "price": 10.99}},
    {{"name": "Item2", "price": 20.99}}
]

Process these invoice rows:

{chr(10).join(rows)}"""
    
    try:
        response = llm.invoke(prompt)

        # Clean the response
        response = response.strip()
        response = response.replace("```json", "").replace("```", "")
        
        # If response doesn't start/end with brackets, add them
        if not response.startswith('['):
            response = '[' + response
        if not response.endswith(']'):
            response = response + ']'
        
        # Replace any line breaks between JSON objects with commas
        response = response.replace('}\n{', '},{')
        
        # Parse and validate JSON
        result = json.loads(response)
        
        # Ensure it's a list
        if not isinstance(result, list):
            raise ValueError("Response is not a JSON array")
            
        return result
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {str(e)}")
        return []
    except Exception as e:
        print(f"Error processing invoices: {str(e)}")
        return []
