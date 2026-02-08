import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads, setAllThreads,
    currThreadId, setNewChat,
    setPrompt, setReply,
    setCurrThreadId, setPrevChats
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/thread");
      const data = await res.json();
      setAllThreads(data.map(t => ({ threadId: t.threadId, title: t.title })));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (id) => {
    setCurrThreadId(id);
    try {
      const res = await fetch(`http://localhost:8080/api/thread/${id}`);
      const data = await res.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>＋ New Chat</button>

      <ul className="history">
        {allThreads.map((t, i) => (
          <li
            key={i}
            className={t.threadId === currThreadId ? "highlighted" : ""}
            onClick={() => changeThread(t.threadId)}
          >
            {t.title}
          </li>
        ))}
      </ul>

      <div className="sign">
        Made by <span>Prashant Chaudhary</span>
      </div>
    </section>
  );
}

export default Sidebar;
