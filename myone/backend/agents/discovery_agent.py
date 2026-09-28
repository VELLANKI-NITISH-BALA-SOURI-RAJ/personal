import json
import os
from openai import AsyncOpenAI
from playwright.async_api import async_playwright
from .models import WebsiteStructure

class WebsiteDiscoveryAgent:
    def __init__(self):
        # Initialize the OpenRouter client
        api_key = os.getenv("OPENROUTER_API_KEY")
        self.client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )
        
        # We will use Gemini 1.5 Pro via OpenRouter
        self.model_name = "google/gemini-1.5-pro"
        
    async def extract_dom(self, url: str) -> str:
        """
        Uses Playwright to visit the URL and extract the simplified DOM.
        """
        async with async_playwright() as p:
            # Launch in headless mode
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # Go to the URL and wait for network idle to ensure JS has loaded
            await page.goto(url, wait_until="networkidle")
            
            # Extract the title
            title = await page.title()
            
            # Evaluate a script in the browser context to extract a simplified representation
            # of interactive elements to save tokens for the LLM
            extracted_html = await page.evaluate('''() => {
                const elements = Array.from(document.querySelectorAll('a, button, input, select, textarea, form, table'));
                return elements.map(el => {
                    const tag = el.tagName.toLowerCase();
                    const id = el.id ? `id="${el.id}"` : '';
                    const cls = el.className ? `class="${el.className}"` : '';
                    const type = el.type ? `type="${el.type}"` : '';
                    const name = el.name ? `name="${el.name}"` : '';
                    const href = el.href ? `href="${el.href}"` : '';
                    const text = el.innerText ? el.innerText.trim().substring(0, 50) : '';
                    
                    return `<${tag} ${id} ${cls} ${type} ${name} ${href}>${text}</${tag}>`;
                }).join('\\n');
            }''')
            
            await browser.close()
            
            return f"<h1>{title}</h1>\n{extracted_html}"

    async def analyze_structure(self, url: str) -> WebsiteStructure:
        """
        Main orchestration method: grabs DOM and passes to Gemini for structuring.
        """
        raw_html = await self.extract_dom(url)
        
        prompt = f"""
        You are an expert QA Engineer. Analyze the following simplified HTML extracted from {url}.
        Your job is to identify forms, interactive elements, and overall structure.
        
        Return the result STRICTLY as a JSON object that conforms to the following schema:
        {WebsiteStructure.model_json_schema()}
        
        Do not include any markdown formatting (like ```json). Just the raw JSON.
        
        HTML Content:
        {raw_html}
        """
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            response_text = response.choices[0].message.content
            
            # Parse the JSON string into our Pydantic model
            data = json.loads(response_text)
            return WebsiteStructure(**data)
        except Exception as e:
            # Fallback or error handling
            print(f"Error parsing AI response: {e}")
            raise ValueError("Failed to parse website structure from AI response.")
