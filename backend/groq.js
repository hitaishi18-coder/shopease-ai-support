const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateReply(history, userMessage, userName) {
  const messages = [
    {
      role: "system",
      content: `
You are a helpful customer support agent for ShopEase.

${userName ? `The user's name is ${userName}. Always remember and use it.` : ""}

Store Policies:
- Shipping: USA, Canada, UK, India (5–7 days)
- Returns: 7 days, unused items
- Support: Mon–Fri, 9 AM–6 PM IST
      `,
    },
    ...history,
    {
      role: "user",
      content: userMessage,
    },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    max_tokens: 200,
  });

  return completion.choices[0].message.content;
}

module.exports = { generateReply };
