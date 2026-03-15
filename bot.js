const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

bot.on("message", async (msg) => {

  if (!msg.text) return;

  const chatId = msg.chat.id;
  const userText = msg.text;

  try {

    const result = await model.generateContent(userText);

    const response = await result.response;

    const reply = response.text();

    bot.sendMessage(chatId, reply);

  } catch (error) {

    console.log(error);
    bot.sendMessage(chatId,"AI error");

  }

});
