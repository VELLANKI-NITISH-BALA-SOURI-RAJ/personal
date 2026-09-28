# Import playwright sync API for browser automation
from playwright.sync_api import sync_playwright
# Import ai_validator's image converter to reuse base64 logic
from ai_validator import image_to_base64
# Import requests for calling the OpenRouter API
import requests
# Import json for parsing API response
import json
# Import openpyxl to append new rows to our Excel sheet
from openpyxl import load_workbook
# Import os and config to handle file paths
import os
import config
# Import datetime for unique timestamps
from datetime import datetime

# Define a function to generate new test cases
def generate_test_cases():
    # Print status message
    print("Opening browser to take screenshot for test generation...")
    # Initialize playwright
    with sync_playwright() as p:
        # Launch Chromium browser
        browser = p.chromium.launch()
        # Create a new page
        page = browser.new_page()
        # Construct the target URL
        url = config.APP_URL
        
        try:
            # Go to the local app URL
            page.goto(url, wait_until="networkidle")
        except Exception:
            # Inform user if app is not running
            print("Warning: Could not load the app. Screenshot might be blank.")
        
        # Define path to save the temporary full page screenshot
        screenshot_path = os.path.join(config.SCREENSHOTS_DIR, "gen_screenshot.png")
        # Take full page screenshot
        page.screenshot(path=screenshot_path, full_page=True)
        # Close the browser to free resources
        browser.close()
        
    print(f"Screenshot taken. Asking AI to generate 5 new test cases...")
    
    # Convert screenshot to base64 string
    base64_img = image_to_base64(screenshot_path)
    
    # Construct the strict prompt for test generation
    # We ask for JSON format so we can easily parse and save to Excel
    prompt = """Act as a Senior QA Test Engineer. Look at this web app screenshot.
Generate detailed test cases for the PNA Viewer screen based on what you see and the rules below.

Module Name:
PNA Viewer

Screen Description:
The screen contains two dropdowns:
1. Server Name
2. Client Name

Business Rules:
1. On page load, Server Name dropdown is enabled.
2. Client Name dropdown is disabled.
3. Client Name dropdown becomes enabled only after selecting a valid Server Name.
4. Client Name values are fetched based on selected Server Name.
5. Changing Server Name clears previously selected Client Name.
6. Server Name and Client Name values are fetched from database.

Fields Available:
- Server Name (Dropdown)
- Client Name (Dropdown)

Generate:
- Functional Test Cases
- UI Test Cases
- Database Validation Test Cases
- Negative Test Cases
- Performance Test Cases

Return ONLY valid JSON in this exact structure:
[
  {
    "scenario_id": "SCN_PNA_FUNC_01",
    "tc_id": "TC_FUNC_001",
    "description": "Test Case Description",
    "pre_condition": "Pre Condition",
    "step_action": "Step Definition",
    "expected": "Expected Result"
  }
]
No markdown, no explanation, only the raw JSON array."""

    # Set up HTTP headers for OpenRouter
    headers = {
        "Authorization": f"Bearer {config.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Prepare the API payload
    payload = {
        "model": config.MODEL_NAME,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_img}"}}
                ]
            }
        ],
        "max_tokens": 8000
    }
    
    try:
        # Send the API request
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        # Parse the JSON response
        data = response.json()
        if 'choices' not in data:
            print("API Error Response:", data)
        # Extract the AI's response text
        content = data['choices'][0]['message']['content'].strip()
        
        # Sometimes AI adds markdown backticks, so we strip them out
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
        # Parse the extracted string into a Python list of dictionaries
        new_test_cases = json.loads(content.strip())
        
        # We need to save these into our Excel file
        file_path = config.TC_FILE
        # Check if the workbook exists
        if os.path.exists(file_path):
            # Load the existing workbook
            wb = load_workbook(filename=file_path)
            # Select the active sheet
            sheet = wb.active
        else:
            # Create a new workbook and add headers
            from openpyxl import Workbook
            wb = Workbook()
            sheet = wb.active
            sheet.append(["Scenario ID", "Testcase ID", "Testcase Description", "Pre-Condition", "Step Action", "Step Expected Result"])
        
        # Print status
        print(f"Successfully generated {len(new_test_cases)} test cases. Appending to Excel...")
        
        # Iterate over each generated test case
        for idx, tc in enumerate(new_test_cases):
            # Create a unique Testcase ID (e.g. TC-PNA-901, 902...)
            new_tc_id = f"TC-PNA-90{idx+1}-{int(datetime.now().timestamp())}"
            # Create a list representing the row data
            row_data = [
                tc.get("scenario_id", "SC-GEN"),
                new_tc_id,
                tc.get("description", ""),
                tc.get("pre_condition", ""),
                tc.get("step_action", ""),
                tc.get("expected", "")
            ]
            # Append the row to the bottom of the Excel sheet
            sheet.append(row_data)
            
        # Save the workbook changes to disk
        wb.save(file_path)
        # Print final success message
        print(f"Saved new test cases to {file_path}")
        
    except Exception as e:
        # Print the error if API call or JSON parsing fails
        print(f"Failed to generate test cases: {str(e)}")