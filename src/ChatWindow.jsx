import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setPrevChats,
    setNewChat
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setNewChat(false);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, threadId: currThreadId })
      });
      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(p => [
        ...p,
        { role: "user", content: prompt },
        { role: "assistant", content: reply }
      ]);
      setPrompt("");
    }
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <div className="brand">
          <h2>Kairo-AI</h2>
          <p>Your intelligent AI companion</p>
        </div>
      </div>

      <Chat />

      {loading && (
  <div className="loaderContainer">
    <ScaleLoader color="#38bdf8" />
  </div>
)}


      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask Kairo-AI anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />
          <div id="submit" onClick={getReply}>➤</div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
