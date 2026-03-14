const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// এখানে Telegram Bot Token বসাবে
const bot = new TelegramBot("8631868074:AAFcC5P0Hc1_E3ImaIIIMKITYWY4MotK3hI", { polling: true });

// এখানে Gemini API Key বসাবে
const genAI = new GoogleGenerativeAI("AIzaSyDkZDAWc7BbMeilB-oog5Qqs0QA72w3Vt0");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

bot.on("message", async (msg) => {

const text = msg.text;

try {

const result = await model.generateContent(text);

const reply = result.response.text();

bot.sendMessage(msg.chat.id, reply);

} catch (e) {

bot.sendMessage(msg.chat.id,"Error occurred");

}

});
