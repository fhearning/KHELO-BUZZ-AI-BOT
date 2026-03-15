import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

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

let reply = "";

try {

const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash"
});

const classifyPrompt = `
তুমি একটি support message classifier।

User message টি নিচের কোন category তে পড়ে তা নির্ধারণ করো।

deposit_problem
withdraw_problem
result_problem
general_question

গুরুত্বপূর্ণ নিয়ম:
যদি নিশ্চিত না হও তাহলে general_question দিবে।

User message:
${text}

শুধু category নাম লিখবে।
`;

const classify = await model.generateContent(classifyPrompt);

const intent = classify.response.text().trim().toLowerCase();


// deposit problem
if (intent === "deposit_problem") {

reply = `দয়া করে আপনার Transaction ID এবং payment screenshot শুধুমাত্র অফিসিয়াল সাপোর্টে পাঠান।

⚠️ কখনো গ্রুপে বা অন্য কাউকে Transaction ID দিবেন না।

সাপোর্ট: @khelobuzz_support`;

}

// withdraw problem
else if (intent === "withdraw_problem") {

reply = `Withdraw সাধারণত 2 থেকে 4 ঘন্টার মধ্যে দেওয়া হয়।

যদি এখনো না পান তাহলে কিছু সময় অপেক্ষা করুন অথবা সাপোর্টে যোগাযোগ করুন।

Minimum withdraw: 55 টাকা

সাপোর্ট: @khelobuzz_support`;

}

// result problem
else if (intent === "result_problem") {

reply = `ম্যাচ শেষ হওয়ার 10-15 মিনিটের মধ্যে result দেওয়া হয়।

যদি result না আসে তাহলে:

১️⃣ Winning screenshot
২️⃣ Game ID name
৩️⃣ Match details

এই তথ্যগুলো সাপোর্টে পাঠান।

সাপোর্ট: @khelobuzz_support`;

}

// AI answer
else {

const systemPrompt = `
তুমি KHELO BUZZ AI BOT।

সবসময় বাংলায় উত্তর দিবে।

KHELO BUZZ একটি Free Fire Tournament প্ল্যাটফর্ম যেখানে user ম্যাচ খেলে ইনকাম করতে পারে।

Website:
https://khelobuzz.live

Top up website:
https://khelo-top-up.vercel.app

Withdraw:
Minimum withdraw 55 টাকা
Method: Bkash / Nagad / Rocket
Time: 2-4 ঘন্টা।

Support:
@khelobuzz_support
`;

const result = await model.generateContent(systemPrompt + "\nUser: " + text);

reply = result.response.text();

}

} catch (e) {

reply = "দয়া করে সাপোর্টে যোগাযোগ করুন: @khelobuzz_support";

}

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
