import json
import requests

def test_receipt_processing():
    # URL of your Flask API
    url = 'http://localhost:5000/api/process-receipt'
    
    # Open image file in binary mode
    with open('IMG_0015_min.png', 'rb') as f:
        # Create files dictionary for multipart/form-data
        files = {
            'image': ('IMG_0015_min.png', f, 'image/png')
        }
        
        try:
            # Make POST request
            response = requests.post(url, files=files)
            
            # Check if request was successful
            response.raise_for_status()
            
            # Try to parse JSON response
            try:
                result = response.json()
                print("Success! Processed results:")
                print(json.dumps(result, indent=2))
            except requests.exceptions.JSONDecodeError as e:
                print(f"Failed to decode JSON response: {str(e)}")
                print(f"Raw response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")

if __name__ == "__main__":
    test_receipt_processing()