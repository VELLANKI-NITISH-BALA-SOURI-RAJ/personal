import os

#API key, app URL, model name — all settings
APP_URL = 'http://localhost:5173/'
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
MODEL_NAME = 'google/gemini-2.5-flash'
SCREENSHOTS_DIR = "screenshots"
REPORTS_DIR = "reports"
TC_FILE = "testcases/tc_sheet.xlsx"

