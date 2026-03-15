const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");

const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

app.post("/bot", async (req, res) => {

  const update = req.body;

  console.log("Telegram update:", update);

  if (!update.message || !update.message.text) {
    return res.sendStatus(200);
  }

  const chatId = update.message.chat.id;
  const text = update.message.text;

  try {
    const result = await model.generateContent(text);
    const reply = result.response.text();

    await bot.sendMessage(chatId, reply);

  } catch (error) {
    console.log(error);
    await bot.sendMessage(chatId, "AI error");
  }

  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
