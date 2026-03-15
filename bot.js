const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");

const app = express();
app.use(express.json());

// Telegram bot (webhook mode)
const bot = new TelegramBot(process.env.BOT_TOKEN);

// Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

// Telegram webhook endpoint
app.post("/bot", async (req, res) => {
  const msg = req.body.message;

  console.log("Update received:", req.body); // log check

  if (!msg || !msg.text) {
    return res.sendStatus(200);
  }

  try {
    const result = await model.generateContent(msg.text);
    const reply = result.response.text();

    await bot.sendMessage(msg.chat.id, reply);

  } catch (error) {
    console.error("AI Error:", error);
    await bot.sendMessage(msg.chat.id, "AI error");
  }

  res.sendStatus(200);
});

// server start
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
