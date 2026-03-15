export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).send("Bot running");
  }

  const update = req.body;

  if (!update.message) {
    return res.status(200).send("ok");
  }

  const chatId = update.message.chat.id;
  const text = update.message.text || "";

  const gemini = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text }]
          }
        ]
      })
    }
  );

  const data = await gemini.json();

  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "AI error";

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
}
