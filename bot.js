const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN);

app.get("/", (req, res) => {
  res.send("Bot running");
});

app.post("/bot", async (req, res) => {

  res.sendStatus(200);

  try {

    const update = req.body;

    if (!update.message) return;

    const chatId = update.message.chat.id;
    const text = update.message.text;

    console.log("MSG:", text);

    await bot.sendMessage(chatId, "Test reply: " + text);

  } catch (err) {
    console.log("ERROR:", err);
  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
