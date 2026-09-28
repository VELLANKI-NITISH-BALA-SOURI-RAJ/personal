// scripts/build_specs.js
// Converts test-data/testcases.json (AI-generated) into a real Playwright
// spec file: tests/pna-viewer.generated.spec.js
//
// This is the "AI test case -> automated browser test" step.

import fs from "fs";

const SELECTORS = {
  serverName: '[data-testid="server-name-dropdown"], select#serverName',
  clientName: '[data-testid="client-name-dropdown"], select#clientName',
};

function loadTestCases() {
  const raw = fs.readFileSync("test-data/testcases.json", "utf-8");
  return JSON.parse(raw);
}

function genStepsForAction(tc) {
  const hint = tc.playwrightHints || {};
  const lines = [];

  lines.push(`  // ${tc.testCaseId} - ${tc.description}`);
  lines.push(`  test('${tc.testCaseId}: ${tc.description.replace(/'/g, "\\'")}', async ({ page }) => {`);
  lines.push(`    await page.goto(BASE_URL);`);

  switch (hint.action) {
    case "check_disabled":
      lines.push(
        `    await expect(page.locator(SELECTORS.${hint.targetField})).toBeDisabled();`
      );
      break;

    case "check_enabled":
      lines.push(
        `    await expect(page.locator(SELECTORS.${hint.targetField})).toBeEnabled();`
      );
      break;

    case "select_dropdown":
      lines.push(
        `    await page.locator(SELECTORS.serverName).selectOption({ label: '${hint.valueToSelect || "Server A"}' });`
      );
      if (hint.targetField === "clientName" || hint.targetField === "both") {
        lines.push(`    await expect(page.locator(SELECTORS.clientName)).toBeEnabled();`);
      }
      break;

    case "check_cleared":
      lines.push(
        `    await page.locator(SELECTORS.serverName).selectOption({ label: 'Server A' });`
      );
      lines.push(
        `    await page.locator(SELECTORS.clientName).selectOption({ index: 1 });`
      );
      lines.push(
        `    await page.locator(SELECTORS.serverName).selectOption({ label: 'Server B' });`
      );
      lines.push(
        `    const clientValue = await page.locator(SELECTORS.clientName).inputValue();`
      );
      lines.push(`    expect(clientValue).toBe('');`);
      break;

    case "check_options_match":
      lines.push(
        `    await page.locator(SELECTORS.serverName).selectOption({ label: '${hint.valueToSelect || "Server A"}' });`
      );
      lines.push(
        `    const options = await page.locator(SELECTORS.clientName + ' option').allTextContents();`
      );
      lines.push(`    expect(options.length).toBeGreaterThan(0);`);
      lines.push(`    // TODO: compare 'options' against expected DB-derived list for this server`);
      break;

    case "measure_time":
      lines.push(`    const start = Date.now();`);
      lines.push(
        `    await page.locator(SELECTORS.serverName).selectOption({ index: 1 });`
      );
      lines.push(
        `    await page.locator(SELECTORS.clientName).waitFor({ state: 'attached' });`
      );
      lines.push(`    const elapsed = Date.now() - start;`);
      lines.push(`    expect(elapsed).toBeLessThan(2000); // 2s threshold, adjust as needed`);
      break;

    default:
      lines.push(`    // MANUAL / NOT AUTOMATED: ${tc.expectedResult}`);
      lines.push(`    test.skip(true, 'Requires manual or DB-level validation');`);
  }

  lines.push(`  });`);
  lines.push("");
  return lines.join("\n");
}

function build() {
  const testCases = loadTestCases();

  const header = `// AUTO-GENERATED FILE - do not edit by hand.
// Source: test-data/testcases.json
// Regenerate with: npm run build
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PNA_VIEWER_URL || 'https://your-internal-domain/pna-viewer';

const SELECTORS = {
  serverName: '${SELECTORS.serverName}',
  clientName: '${SELECTORS.clientName}',
};

test.describe('PNA Viewer - AI Generated Test Suite', () => {
`;

  const footer = `});\n`;

  const automatable = testCases.filter((tc) => tc.automatable !== false);
  const skipped = testCases.filter((tc) => tc.automatable === false);

  const body = automatable.map(genStepsForAction).join("\n");

  fs.mkdirSync("tests", { recursive: true });
  fs.writeFileSync("tests/pna-viewer.generated.spec.js", header + body + footer);

  if (skipped.length) {
    const manualList = skipped
      .map((tc) => `- [${tc.testCaseId}] ${tc.description} (Category: ${tc.category})`)
      .join("\n");
    fs.writeFileSync(
      "test-data/manual_db_testcases.md",
      `# Test cases requiring direct DB validation (not Playwright-automatable)\n\n${manualList}\n`
    );
    console.log(`${skipped.length} DB-only test cases written to test-data/manual_db_testcases.md`);
  }

  console.log(
    `Built tests/pna-viewer.generated.spec.js with ${automatable.length} automated test(s).`
  );
}

build();
