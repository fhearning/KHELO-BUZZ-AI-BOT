const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");

const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// health check
app.get("/", (req, res) => {
  res.send("Bot running");
});

// Telegram webhook
app.post("/bot", async (req, res) => {
  res.sendStatus(200); // Telegram কে সাথে সাথে OK দিতে হবে

  try {
    const msg = req.body.message;
    if (!msg || !msg.text) return;

    const chatId = msg.chat.id;
    const text = msg.text;

    const result = await model.generateContent(text);
    const reply = result.response.text();

    await bot.sendMessage(chatId, reply);

  } catch (err) {
    console.log("AI Error:", err);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
