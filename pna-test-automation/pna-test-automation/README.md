# PNA Viewer — AI-Generated + Playwright-Automated Test Suite

End-to-end pipeline:

```
Screen spec → Claude API generates test cases (JSON)
            → Script converts JSON → real Playwright test file
            → Playwright runs tests on your actual website (VPN/internal)
            → Playwright auto-generates an HTML report
```

## 1. Prerequisites
- Node.js 18+ installed
- You are connected to your internal VPN (since PNA Viewer is internal-only)
- An Anthropic API key: https://console.anthropic.com/

## 2. Setup

```bash
cd pna-test-automation
npm install
npx playwright install chromium   # downloads the browser binary
cp .env.example .env
```

Edit `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...your real key...
PNA_VIEWER_URL=https://your-internal-domain/pna-viewer
```

## 3. Adjust selectors (important)

Open `scripts/build_specs.js` and `scripts/generate_testcases.js`, and update the
`SELECTORS` object to match the REAL dropdown element IDs/attributes on your PNA Viewer
page. Right-click the dropdown in your browser → Inspect → copy its `id` or add a
`data-testid` if you control the frontend code. This is the only manual step —
everything else is automatic.

## 4. Run the full pipeline

```bash
npm run all
```

This will:
1. `generate` — call Claude API, write `test-data/testcases.json`
2. `build` — convert that JSON into `tests/pna-viewer.generated.spec.js`
3. `test` — run Playwright against `PNA_VIEWER_URL` in a real Chromium browser
4. `report` — open the HTML report in your browser

Or run steps individually:
```bash
npm run generate   # AI generates test cases
npm run build       # convert to Playwright code
npm test            # run against the real site
npm run report      # view results
```

## 5. Output

- `test-data/testcases.json` — AI-generated test cases (editable/reviewable before running)
- `test-data/manual_db_testcases.md` — test cases that need direct DB queries (Playwright
  can't reach a database directly; these need a DB client or API check instead)
- `tests/pna-viewer.generated.spec.js` — the actual automated Playwright test code
- `playwright-report/index.html` — the final report (pass/fail, screenshots, traces)

## Notes
- Database Validation test cases are flagged `automatable: false` by the AI and routed
  to a manual checklist, since Playwright drives a browser, not a database. To automate
  those too, add a DB client (e.g. `pg`, `mysql2`) and write assertions comparing DB
  query results to the UI dropdown list — ask Claude Code to wire this in if needed.
- Re-run `npm run generate` any time you change business rules — it regenerates the
  test case set from scratch via the API.
- Review `test-data/testcases.json` before running against production data, especially
  if any test case involves deleting/modifying records.
