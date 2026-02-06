import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
const url = "https://api.groq.com/openai/v1/models";

const headers = {
  "Authorization": `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

async function getModels() {
  const res = await fetch(url, { headers });
  const data = await res.json();
  console.log(data);
}

getModels();
