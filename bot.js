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

  const msg = req.body.message;

  if (!msg || !msg.text) return res.sendStatus(200);

  try {

    const result = await model.generateContent(msg.text);
    const reply = result.response.text();

    await bot.sendMessage(msg.chat.id, reply);

  } catch (e) {

    await bot.sendMessage(msg.chat.id, "AI error");

  }

  res.sendStatus(200);

});

app.listen(process.env.PORT || 3000);
