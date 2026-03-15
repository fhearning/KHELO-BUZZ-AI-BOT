import TelegramBot from "node-telegram-bot-api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const bot = new TelegramBot(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).send("Bot running");
  }

  const update = req.body;

  if (!update.message) {
    return res.status(200).send("ok");
  }

  const chatId = update.message.chat.id;
  const text = update.message.text;

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(text);

    const reply = result.response.text();

    await bot.sendMessage(chatId, reply);

  } catch (e) {

    await bot.sendMessage(chatId, "AI error");
  }

  return res.status(200).send("ok");
}
