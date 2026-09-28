import json
import requests
from playwright.sync_api import sync_playwright
import os
import time
import config

os.makedirs(config.SCREENSHOTS_DIR, exist_ok=True)

def generate_playwright_actions(step_action):
    """
    Calls the LLM to translate a natural language step into structured Playwright JSON actions.
    """
    prompt = f"""You are a Playwright automation expert. 
Map the following test step action to structured JSON actions.
Test Step Action: "{step_action}"

Available UI context:
- The app uses Material-UI. DO NOT click on labels using 'text=' for dropdowns.
- To click the Server Name dropdown, use the exact selector: "#server-name-select"
- To click the Client Name dropdown, use the exact selector: "#client-name-select"
- To select an option after opening a dropdown, press ArrowDown then Enter.

Return ONLY valid JSON in this structure:
[
  {{"action": "click", "selector": "#server-name-select"}},
  {{"action": "press", "key": "ArrowDown"}},
  {{"action": "press", "key": "Enter"}},
  {{"action": "wait", "time": 1000}}
]
No markdown, no explanation, only the raw JSON array.
"""
    headers = {
        "Authorization": f"Bearer {config.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": config.MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 1000
    }
    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        data = response.json()
        content = data['choices'][0]['message']['content'].strip()
        
        # Clean up markdown formatting
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
        return json.loads(content.strip())
    except Exception as e:
        print(f"  -> AI Action mapping failed or returned invalid JSON: {e}")
        return []

def run_all_tests(test_cases):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        
        url = config.APP_URL
        
        for tc in test_cases:
            tc_id = tc["tc_id"]
            # Some test generators use description instead of step_action, so we fallback
            step_action = tc.get("step_action", tc.get("description", "Observe page load"))
            
            print(f"\n---")
            print(f"Running {tc_id}: {step_action}")
            
            # 1. Reset state: Reload page before each test
            try:
                page.goto(url, wait_until="networkidle")
                time.sleep(1) # Extra buffer for render
            except Exception as e:
                print(f"Warning: Could not connect to {url}. App might be offline.")
                
            # 2. Get dynamic actions from LLM
            actions = generate_playwright_actions(step_action)
            print(f"  -> Dynamic Actions: {actions}")
            
            # 3. Execute actions dynamically
            for act in actions:
                try:
                    action_type = act.get("action")
                    if action_type == "click":
                        page.locator(act["selector"]).first.click(timeout=3000, force=True)
                        time.sleep(0.5) # Give UI time to open the dropdown
                    elif action_type == "fill":
                        page.locator(act["selector"]).first.fill(act["value"], timeout=3000)
                    elif action_type == "press":
                        page.keyboard.press(act["key"])
                    elif action_type == "wait":
                        time.sleep(act["time"] / 1000.0)
                except Exception as e:
                    print(f"  -> [Warning] Failed to execute {act}: {e}")
            
            # Final buffer before screenshot
            time.sleep(1)
            
            # 4. Take the screenshot
            screenshot_filename = f"{tc_id}_screenshot.png"
            screenshot_path = os.path.join(config.SCREENSHOTS_DIR, screenshot_filename)
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"  -> Saved screenshot: {screenshot_path}")
            
            tc["screenshot_path"] = screenshot_path
            
        browser.close()
    return test_cases