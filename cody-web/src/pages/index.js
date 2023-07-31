import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const sysMessage =
  "You are cody, an AI created by #codEasy using state-of-the art Machine LEarning Models and API's which is a helpful and versatile AI";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: sysMessage,
    },
  ]);

  const [userMessage, setUserMessage] = useState("");

  const API_URL = "https://api.openai.com/v1/chat/completions";

  async function sendRequest() {
    //update the message history

    const newMessage = { role: "user", content: userMessage };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setUserMessage("");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: newMessages,
      }),
    });
    const responseJson = await response.json();
    const newBotMessage = responseJson.choices[0].message;
    const newMessages2 = [...newMessages, newBotMessage];
    setMessages(newMessages2);
    // setBotMessage(reponseJson.choices[0].message.content);
  }

  return (
    <div className="flex flex-col h-screen">
      <nav className="shadow px-8 py-4 flex flex-row justify-between items-center">
        <div className="text-xl font-bold">#codEasy</div>
        <div>
          <input
            type="password"
            className="border p-2 rounded"
            placeholder="Paste API Key here"
            onChange={(e) => setApiKey(e.target.value)}
            value={apiKey}
          ></input>
        </div>
      </nav>
      <div className="flex-1 max-w-screen-md mx-auto px-4 overflow-y-scroll">
        {messages.filter(message => message.role!=="system").map((message, index) => (
          <div key={index} className="mt-3">
            <div className="font-bold">{message.role === "user" ? "You" : "Cody"}</div>
            <div className="text-lg prose">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
              </div>
          </div>
        ))}
      </div>
      <div className="w-full max-w-screen-md mx-auto flex p-4">
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="border text-lg rounded-md p-2 flex-1"
          rows={1}
        />
        <button
          onClick={sendRequest}
          className="bg-purple-500 hover:bg-purple-700 border rounded-md text-lg-white p-4 w-20 ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}
