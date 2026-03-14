const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Telegram Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest"
});

// Message listener
bot.on("message", async (msg) => {

  const chatId = msg.chat.id;

  // text না থাকলে ignore
  if (!msg.text) return;

  const userText = msg.text;

  try {

    const result = await model.generateContent(userText);

    const response = await result.response;

    const reply = response.text();

    bot.sendMessage(chatId, reply);

  } catch (error) {

    console.log("Gemini Error:", error);

    bot.sendMessage(chatId, "AI error");

  }

});
