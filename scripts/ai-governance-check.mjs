import OpenAI from "openai";
import { execSync } from "node:child_process";
import fs from "fs";
import "dotenv/config";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Get staged files
const diff = execSync("git diff --cached --name-only", { encoding: "utf8" });
const files = diff
  .split("\n")
  .filter((f) => f.endsWith(".tsx") || f.endsWith(".stories.tsx"));

if (files.length === 0) {
  console.log("No TSX / Storybook files staged. Skipping AI governance check.");
  process.exit(0);
}

// 2. Load rules
const rules = fs.readFileSync("./governance/rules.md", "utf8");

// 3. Read file contents
const snippets = files.map((path) => ({
  path,
  content: fs.readFileSync(path, "utf8"),
}));

// 4. Ask AI to review
const response = await client.responses.create({
  model: "gpt-4.1-mini",
  response_format: { type: "json_object" },
  input: [
    {
      role: "system",
      content: `
You are a strict design system governance bot.
You review React components and Storybook stories against the rules provided.
Return JSON with this shape:

{
  "summary": "short human-readable summary",
  "blockingIssues": ["issue 1", "issue 2"],
  "warnings": ["warning 1", "warning 2"]
}

Rules:
${rules}
      `,
    },
    {
      role: "user",
      content:
        "Review these files and tell me what breaks the rules:\n" +
        JSON.stringify(snippets, null, 2),
    },
  ],
});

const raw = response.output[0].content[0].text;
const result = JSON.parse(raw);

// 5. Print result
console.log("\nAI governance summary:\n", result.summary || "(no summary)");

if (result.warnings?.length) {
  console.log("\nWarnings:");
  for (const w of result.warnings) console.log(" -", w);
}

if (result.blockingIssues?.length) {
  console.error("\nBlocking issues:");
  for (const b of result.blockingIssues) console.error(" -", b);
  process.exit(1); // fail command
}

console.log("\nNo blocking issues. ✅");