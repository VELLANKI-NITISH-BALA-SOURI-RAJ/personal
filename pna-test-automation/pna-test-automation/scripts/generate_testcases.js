// scripts/generate_testcases.js
// Calls the Anthropic API to auto-generate structured test cases for the
// PNA Viewer screen. Output: test-data/testcases.json
//
// This is the "AI generates the test cases" step — nothing here is
// hand-written; the model produces the scenarios based on the screen
// description + business rules you give it below.

import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---- Describe your screen here. Edit this freely for other screens/modules ----
const SCREEN_SPEC = `
Module Name: PNA Viewer
Screen Description:
Two dropdowns:
1. Server Name
2. Client Name

Business Rules:
1. On page load, Server Name dropdown is enabled.
2. Client Name dropdown is disabled.
3. Client Name dropdown becomes enabled only after selecting a valid Server Name.
4. Client Name values are fetched based on selected Server Name.
5. Changing Server Name clears previously selected Client Name.
6. Server Name and Client Name values are fetched from a database.

Known selectors on the real page (fill in / adjust if different):
- Server Name dropdown: [data-testid="server-name-dropdown"] (fallback: select#serverName)
- Client Name dropdown: [data-testid="client-name-dropdown"] (fallback: select#clientName)
`;

const SYSTEM_PROMPT = `You are a Senior QA Automation Engineer. You generate test cases that will
later be converted 1:1 into Playwright test scripts. Output ONLY valid JSON, no markdown
fences, no commentary, no preamble.

Return a JSON array. Each item must have exactly these fields:
{
  "scenarioId": "SCN-01",
  "testCaseId": "TC-001",
  "category": "Functional" | "UI" | "Database" | "Negative" | "Performance",
  "description": "short description",
  "preCondition": "state before test starts",
  "steps": ["step 1", "step 2", "..."],
  "expectedResult": "what should happen",
  "automatable": true | false,
  "playwrightHints": {
    "action": "select_dropdown" | "check_disabled" | "check_enabled" | "check_cleared" | "check_options_match" | "measure_time" | "custom",
    "targetField": "serverName" | "clientName" | "both",
    "valueToSelect": "string or null",
    "notes": "any extra detail useful for writing the Playwright code"
  }
}

Rules:
- Generate Functional, UI, Database Validation, Negative, and Performance test cases.
- Database Validation cases should be marked automatable=false if they require direct DB queries
  not reachable via the browser (Playwright can't query a database by itself).
- Be specific and avoid vague steps.
- Output strictly valid JSON array, nothing else.`;

async function main() {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("xxxx")) {
    console.error("ERROR: Set a real ANTHROPIC_API_KEY in your .env file first.");
    process.exit(1);
  }

  console.log("Calling Claude API to generate test cases...");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: SCREEN_SPEC }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  let testCases;
  try {
    const cleaned = text.replace(/^```json\s*|\s*```$/g, "");
    testCases = JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse model output as JSON:");
    console.error(text);
    process.exit(1);
  }

  fs.mkdirSync("test-data", { recursive: true });
  fs.writeFileSync(
    "test-data/testcases.json",
    JSON.stringify(testCases, null, 2)
  );

  console.log(`Generated ${testCases.length} test cases -> test-data/testcases.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
