const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const bot = new TelegramBot(8631868074:AAFcC5P0Hc1_E3ImaIIIMKITYWY4MotK3hI, { polling: true });

const genAI = new GoogleGenerativeAI(AIzaSyDkZDAWc7BbMeilB-oog5Qqs0QA72w3Vt0);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

bot.on("message", async (msg) => {

if (!msg.text) return;

try {

const result = await model.generateContent({
contents: [{ role: "user", parts: [{ text: msg.text }] }]
});

const reply = result.response.text();

bot.sendMessage(msg.chat.id, reply);

} catch (error) {

console.log(error);
bot.sendMessage(msg.chat.id,"AI error");

}

});
