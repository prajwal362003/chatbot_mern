import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import toast from "react-hot-toast";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);

  async function fetchResponse() {
    if (prompt === "") return alert("Write Prompt");
    setNewRequestLoading(true);
    setPrompt("");
    try {
      const response = await axios({
        method: "post",
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDnNeg1olPlagBam-XsNb3BN-mVJK_oVtE",
        data: {
          contents: [{ parts: [{ text: prompt }] }],
        },
      });

      const message = {
        question: prompt,
        answer:
          response["data"]["candidates"][0]["content"]["parts"][0]["text"],
      };
      setMessage((prev) => [...prev, message]);
      setNewRequestLoading(false);

      const { data } = await axios.post(
        `${server}/api/chat/${selected}`,
        {
          question: prompt,
          answer:
            response["data"]["candidates"][0]["content"]["parts"][0]["text"],
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
      setNewRequestLoading(false);
    }
  }

  const [chats, setChats] = useState([]);

  const [selected, setSelected] = useState(null);

  async function fetchChats() {
    try {
      const { data } = await axios.get(`${server}/api/chat/all`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      console.log(data);
      setChats(data);
      setSelected(data[0]._id);
    } catch (error) {
      console.error(error);
    }
  }

  const [createLoad, setCreateLoad] = useState(false);
  async function createChat() {
    setCreateLoad(true);
    try {
      const { data } = await axios.post(
        `${server}/api/chat/new`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      fetchChats();
      setCreateLoad(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setCreateLoad(false);
    }
  }
  const [loading, setLoading] = useState(false);

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/chat/${selected}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMessage(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function deleteChat(id) {
    try {
      const { data } = await axios.delete(`${server}/api/chat/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      fetchChats();
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("something went wrong");
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selected]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        message,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createLoad,
        fetchChats,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
