import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function Home() {
  const completion = await groq.chat.completions
    .create({
      messages: [
        {
          role: "system",
          content:
            "You are a Clara, smart personal assistant. Be polite, always",
        },
        {
          role: "user",
          content: "Who are you?",
        },
      ],
      model: "llama-3.3-70b-versatile",
    })
    .then((chatCompletion) => {
      console.log(chatCompletion.choices[0]?.message?.content || "");
    });
  return <div>Hey I am Clara!</div>;
}
