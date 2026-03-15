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

app.get("/", (req, res) => {
  res.send("Bot running");
});

app.post("/bot", async (req, res) => {

  res.sendStatus(200); // Telegram কে সাথে সাথে response

  try {

    const update = req.body;

    if (!update) return;

    if (!update.message) return;

    if (!update.message.text) return;

    const chatId = update.message.chat.id;
    const text = update.message.text;

    console.log("Message:", text);

    const result = await model.generateContent(text);
    const reply = result.response.text();

    await bot.sendMessage(chatId, reply);

  } catch (err) {
    console.log("ERROR:", err);
  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
