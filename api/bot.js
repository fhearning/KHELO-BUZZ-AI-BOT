import TelegramBot from "node-telegram-bot-api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const bot = new TelegramBot(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).send("Bot running");
  }

  const msg = req.body.message;

  if (!msg || !msg.text) {
    return res.status(200).send("ok");
  }

  const chatId = msg.chat.id;
  const text = msg.text;

  let reply = "";

  // start command
  if (text.toLowerCase() === "/start") {
    reply = "Welcome to KHELO BUZZ AI BOT 🙂\n\nAsk me anything about Khelo Buzz.";
  }

  // bad word filter
  const badWords = ["fuck","madarchod","maderchod","kutta"];

  if (badWords.some(w => text.toLowerCase().includes(w))) {
    reply = "Please use respectful language 🙂";
  }

  // AI reply
  if (!reply) {

    const systemPrompt = `
You are KHELO BUZZ AI BOT.

Rules:
- Help users about Khelo Buzz app
- Answer in Bangla or English
- Be polite
- If user uses bad language warn them
- Help with topup, withdraw, match issues
`;

    const result = await model.generateContent(systemPrompt + "\nUser: " + text);

    reply = result.response.text();
  }

  await bot.sendMessage(chatId, reply);

  res.status(200).send("ok");
}
