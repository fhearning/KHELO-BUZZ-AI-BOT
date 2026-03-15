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

// AI intent detection
const classifyPrompt = `
এই মেসেজটি কোন ধরনের সমস্যা তা নির্ধারণ করুন।

category:
deposit_problem
withdraw_problem
result_problem
scam_warning
general_question

message:
${text}

শুধু category name লিখুন।
`;

const classify = await model.generateContent(classifyPrompt);

const intent = classify.response.text().trim().toLowerCase();


// Deposit problem
if (intent.includes("deposit_problem")) {

reply = `দয়া করে আপনার Transaction ID এবং payment screenshot শুধুমাত্র অফিসিয়াল সাপোর্টে পাঠান।

⚠️ কখনো গ্রুপে বা অন্য কাউকে Transaction ID দিবেন না।

সাপোর্ট: @khelobuzz_support`;

}

// Withdraw problem
else if (intent.includes("withdraw_problem")) {

reply = `Withdraw সাধারণত 2 থেকে 4 ঘন্টার মধ্যে দেওয়া হয়।

যদি এখনো না পান তাহলে কিছু সময় অপেক্ষা করুন অথবা সাপোর্টে যোগাযোগ করুন।

Minimum withdraw: 55 টাকা
Method: Bkash / Nagad / Rocket

সাপোর্ট: @khelobuzz_support`;

}

// Match result problem
else if (intent.includes("result_problem")) {

reply = `ম্যাচ শেষ হওয়ার 10-15 মিনিটের মধ্যে result দেওয়া হয়।

যদি result না আসে তাহলে:

১️⃣ Winning screenshot  
২️⃣ Game ID name  
৩️⃣ Match details  

এই তথ্যগুলো সাপোর্টে পাঠান।

সাপোর্ট: @khelobuzz_support`;

}

// Scam warning
else if (intent.includes("scam_warning")) {

reply = `⚠️ সতর্কতা

কখনো আপনার Transaction ID বা payment screenshot কাউকে দিবেন না।

শুধুমাত্র অফিসিয়াল সাপোর্টে দিবেন।

সাপোর্ট: @khelobuzz_support`;

}

// AI answer
else {

const systemPrompt = `
আপনি KHELO BUZZ AI BOT।

গুরুত্বপূর্ণ নিয়ম:
সবসময় বাংলায় উত্তর দিবেন।

KHELO BUZZ একটি Free Fire Tournament প্ল্যাটফর্ম।

Website:
https://khelobuzz.live

Top up website:
https://khelo-top-up.vercel.app

User এখানে ম্যাচ খেলে ইনকাম করতে পারে।

Withdraw:
Minimum withdraw 55 টাকা
Method: Bkash / Nagad / Rocket
Time: সাধারণত 2-4 ঘন্টার মধ্যে।

Support Telegram:
@khelobuzz_support

কখনো Transaction ID বা payment screenshot পাবলিক গ্রুপে দিতে বলবেন না।
`;

const result = await model.generateContent(systemPrompt + "\nUser: " + text);

reply = result.response.text();

}

} catch (e) {

reply = "দয়া করে সাপোর্টের সাথে যোগাযোগ করুন: @khelobuzz_support";

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
