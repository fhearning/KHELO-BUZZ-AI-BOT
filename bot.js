const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;

app.get("/", (req, res) => {
  res.send("Bot running");
});

app.post("/bot", async (req, res) => {

  res.sendStatus(200);

  try {

    const msg = req.body.message;
    if (!msg) return;

    const chatId = msg.chat.id;
    const text = msg.text || "";

    const reply = "Echo: " + text;

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply
      })
    });

  } catch (err) {
    console.log(err);
  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
