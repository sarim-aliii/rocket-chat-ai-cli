const dotenv = require("dotenv");

dotenv.config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in .env");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

checkModels();