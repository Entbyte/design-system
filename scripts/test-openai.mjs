import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is missing in .env");
    process.exit(1);
  }

  console.log("Calling OpenAI…");

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: "Reply with exactly this text: AI test OK",
  });

  const text = response.output[0].content[0].text;
  console.log("✅ OpenAI replied:", text);
}

main().catch((err) => {
  console.error("❌ Error calling OpenAI:", err);
  process.exit(1);
});