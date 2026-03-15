export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).send("Bot running");
  }

  try {

    const update = req.body;

    if (!update.message) {
      return res.status(200).send("ok");
    }

    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    const reply = "Echo: " + text;

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply
      })
    });

    return res.status(200).send("ok");

  } catch (err) {

    console.log(err);
    return res.status(200).send("ok");

  }

}
