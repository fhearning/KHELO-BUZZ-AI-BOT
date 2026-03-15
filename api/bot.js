import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// ===== Fixed Support Answers =====
const DEPOSIT_REPLY = `দয়া করে আপনার Transaction ID এবং payment screenshot শুধুমাত্র অফিসিয়াল সাপোর্টে পাঠান।

⚠️ কখনো গ্রুপে বা অন্য কাউকে Transaction ID বা payment screenshot দিবেন না।

Support Telegram: @khelobuzz_support`;

const WITHDRAW_REPLY = `Withdraw সাধারণত 2 থেকে 4 ঘন্টার মধ্যে দেওয়া হয়।

যদি এখনো না পান তাহলে কিছু সময় অপেক্ষা করুন অথবা সাপোর্টে যোগাযোগ করুন।

Withdraw method: Bkash / Nagad / Rocket
Minimum withdraw: 55 টাকা

Support: @khelobuzz_support`;

const RESULT_REPLY = `ম্যাচ শেষ হওয়ার 10 থেকে 15 মিনিটের মধ্যে result দেওয়া হয়।

যদি result না আসে তাহলে:

1️⃣ Winning screenshot
2️⃣ Game ID name
3️⃣ Match details

এই তথ্যগুলো সাপোর্টে পাঠান।

Support: @khelobuzz_support`;

const SCAM_REPLY = `⚠️ সতর্কতা

কখনো আপনার Transaction ID বা payment screenshot কাউকে দিবেন না।

শুধুমাত্র অফিসিয়াল সাপোর্টে দিবেন।

Support: @khelobuzz_support`;

const BAD_WORD_REPLY = `Please use respectful language 🙂`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Bot running");
  }

  const update = req.body;
  if (!update.message) {
    return res.status(200).send("ok");
  }

  const msg = update.message;
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();
  const lower = text.toLowerCase();

  // ===== Admin Filter (ignore admin messages in groups) =====
  const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
  if (isGroup && Array.isArray(msg.new_chat_members)) {
    // system join messages ignore
    return res.status(200).send("ok");
  }
  if (isGroup && msg.from && msg.from.is_bot) {
    return res.status(200).send("ok");
  }

  // ===== Bad language filter =====
  const badWords = ["fuck","madarchod","maderchod","kutta","fuck you"];
  if (badWords.some(w => lower.includes(w))) {
    await send(chatId, BAD_WORD_REPLY);
    return res.status(200).send("ok");
  }

  // ===== Quick Scam Warning =====
  if (lower.includes("transaction id dao") || lower.includes("payment proof dao")) {
    await send(chatId, SCAM_REPLY);
    return res.status(200).send("ok");
  }

  // ===== AI Intent Detection (Bangla/English/Banglish) =====
  let intent = "other";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const classifyPrompt = `
Classify the user's message intent into one of these categories only:
deposit_problem
withdraw_problem
result_problem
other

User message:
${text}

Return only the category name.`;

    const r = await model.generateContent(classifyPrompt);
    intent = (r.response.text() || "").trim().toLowerCase();
  } catch (e) {
    intent = "other";
  }

  // ===== Fixed Answers based on intent =====
  if (intent.includes("deposit")) {
    await send(chatId, DEPOSIT_REPLY);
    return res.status(200).send("ok");
  }

  if (intent.includes("withdraw")) {
    await send(chatId, WITHDRAW_REPLY);
    return res.status(200).send("ok");
  }

  if (intent.includes("result")) {
    await send(chatId, RESULT_REPLY);
    return res.status(200).send("ok");
  }

  // ===== AI General Answer =====
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
You are KHELO BUZZ AI BOT.

KHELO BUZZ is a Free Fire Tournament platform where users can play matches and earn money.

Website:
https://khelobuzz.live

Top up:
Users can deposit any amount.
Payment methods: Bkash, Nagad.
Top up website: https://khelo-top-up.vercel.app

Withdraw:
Minimum withdraw: 55 BDT
Methods: Bkash, Nagad, Rocket
Time: Usually 2-4 hours

Match:
Game: Free Fire
Result time: 10-15 minutes after match

Support:
Telegram: @khelobuzz_support

Security rules:
Fake payment screenshot → banned
Multiple accounts → banned
Never share transaction ID or payment screenshot publicly.

Referral:
Minimum referral deposit: 100 BDT

Bonus:
10 BDT

Events:
Announced in Telegram channel.

Answer politely and help users regarding Khelo Buzz.
`;

    const result = await model.generateContent(systemPrompt + "\nUser: " + text);
    const reply = result.response.text() || "Please contact support: @khelobuzz_support";

    await send(chatId, reply);
  } catch (e) {
    await send(chatId, "Please contact support: @khelobuzz_support");
  }

  return res.status(200).send("ok");
}

// ===== Telegram sendMessage helper =====
async function send(chatId, text) {
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text
    })
  });
}
