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

    // STEP 1 — AI intent detection
    const classifyPrompt = `
তুমি একটি Telegram support classifier।

User message পড়ে category নির্ধারণ করো।

category হতে পারে:

deposit
withdraw
result
other

User message:
${text}

শুধু category নাম লিখবে।
`;

    const classify = await model.generateContent(classifyPrompt);

    const intent = classify.response.text().trim().toLowerCase();

    // STEP 2 — Fixed answers

    if (intent === "deposit") {

      reply = `দয়া করে আপনার Transaction ID এবং payment screenshot শুধুমাত্র অফিসিয়াল সাপোর্টে পাঠান।

⚠️ কখনো গ্রুপে Transaction ID দিবেন না।

সাপোর্ট: @khelobuzz_support`;

    }

    else if (intent === "withdraw") {

      reply = `Withdraw সাধারণত ২ থেকে ৪ ঘন্টার মধ্যে দেওয়া হয়।

Minimum withdraw: ৫৫ টাকা

যদি এখনো না পান তাহলে সাপোর্টে যোগাযোগ করুন।

সাপোর্ট: @khelobuzz_support`;

    }

    else if (intent === "result") {

      reply = `ম্যাচ শেষ হওয়ার ১০-১৫ মিনিটের মধ্যে result দেওয়া হয়।

যদি result না আসে তাহলে:

১️⃣ Winning screenshot  
২️⃣ Game ID name  
৩️⃣ Match details  

এই তথ্যগুলো সাপোর্টে পাঠান।

সাপোর্ট: @khelobuzz_support`;

    }

    // STEP 3 — AI normal answer
    else {

      const systemPrompt = `
তুমি KHELO BUZZ AI BOT।

সবসময় বাংলায় উত্তর দিবে।

KHELO BUZZ একটি Free Fire Tournament প্ল্যাটফর্ম।

Website:
https://khelobuzz.live

Top up website:
https://khelo-top-up.vercel.app

User এখানে ম্যাচ খেলে ইনকাম করতে পারে।

Withdraw:
Minimum withdraw: ৫৫ টাকা
Method: Bkash / Nagad / Rocket
Time: ২-৪ ঘন্টা।

Support Telegram:
@khelobuzz_support
`;

      const result = await model.generateContent(systemPrompt + "\nUser: " + text);

      reply = result.response.text();

    }

  } catch (err) {

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
