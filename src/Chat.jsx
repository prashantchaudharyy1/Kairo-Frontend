import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (!reply) return setLatestReply(null);
    const words = reply.split(" ");
    let i = 0;

    const interval = setInterval(() => {
      setLatestReply(words.slice(0, i + 1).join(" "));
      i++;
      if (i >= words.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [reply]);

  return (
    <div className="chats">
      {newChat && (
        <div className="welcome">
          <h1>Kairo-AI</h1>
          <p>Ask. Think. Create.</p>
        </div>
      )}

      {prevChats.slice(0, -1).map((c, i) => (
        <div key={i} className={c.role === "user" ? "userDiv" : "gptDiv"}>
          {c.role === "user"
            ? <p className="userMessage">{c.content}</p>
            : <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{c.content}</ReactMarkdown>}
        </div>
      ))}

      {prevChats.length > 0 && (
        <div className="gptDiv">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {latestReply || prevChats.at(-1).content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default Chat;
