# Import base64 module to encode the screenshot image
import base64
# Import requests module to make HTTP calls to the OpenRouter API
import requests
# Import json module to parse the API response
import json
# Import config to get our API key and Model name
import config

# Define a function to convert an image file to a base64 string
def image_to_base64(image_path):
    # Open the image file in read-binary mode ('rb')
    with open(image_path, "rb") as image_file:
        # Read the file contents, encode them as base64, and decode the bytes to a string
        return base64.b64encode(image_file.read()).decode('utf-8')

# Define the main validation function that takes a screenshot path and the expected result
def validate_screenshot(screenshot_path, expected_result):
    # Get the base64 string of the screenshot
    base64_image = image_to_base64(screenshot_path)
    
    # Construct the system prompt explaining the AI's role
    prompt = f"You are a QA testing assistant. Look at the screenshot of the web app. The expected result for this test step is: '{expected_result}'. Does the screenshot match the expected result? Reply with exactly 'Pass' or 'Fail' on the first line, followed by a newline, and then a plain English reason on the second line."
    
    # Define the headers required for the OpenRouter API request
    headers = {
        # Pass the Authorization token using the API key from config
        "Authorization": f"Bearer {config.OPENROUTER_API_KEY}",
        # Set the content type to application/json
        "Content-Type": "application/json"
    }
    
    # Prepare the JSON payload payload with the model and messages
    payload = {
        # Use the specific free model requested by the user
        "model": config.MODEL_NAME,
        # Provide the conversation messages
        "messages": [
            {
                # Set the role to user
                "role": "user",
                # The content must be an array containing both text and image
                "content": [
                    {
                        # Text part of the message
                        "type": "text",
                        "text": prompt
                    },
                    {
                        # Image part of the message
                        "type": "image_url",
                        "image_url": {
                            # Format the base64 string properly with the data URI scheme
                            "url": f"data:image/png;base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    }
    
    try:
        # Make a POST request to the OpenRouter chat completions endpoint
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        # Parse the JSON response text into a Python dictionary
        response_data = response.json()
        
        # Extract the assistant's reply content from the response
        ai_reply = response_data['choices'][0]['message']['content'].strip()
        
        # Split the reply into lines to separate status and reason
        lines = ai_reply.split('\n')
        # The first line should be the status (Pass or Fail)
        status = lines[0].strip()
        # The reason is everything else combined
        reason = " ".join(lines[1:]).strip() if len(lines) > 1 else "No reason provided by AI."
        
        # Ensure the status is strictly either Pass or Fail
        if "pass" in status.lower():
            status = "Pass"
        else:
            status = "Fail"
            
        # Return the dictionary with the parsed status and reason
        return {"status": status, "reason": reason}
        
    except Exception as e:
        # If any error occurs, catch it and return a Failed status with the error message
        return {"status": "Fail", "reason": f"API Error: {str(e)}"}