import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ChatData } from "../context/ChatContext";
import { MdDelete } from "react-icons/md";
import { LoadingSpinner } from "./Loading";
import { UserData } from "../context/UserContext";

const SideBar = ({ isOpen, toggleSideBar }) => {
  const { chats, createChat, createLoad, setSelected, deleteChat } = ChatData();
  const { logoutHandler } = UserData();

  const deleteChatHandler = (id) => {
    if (confirm("Are you sure you want to delte this chat")) {
      deleteChat(id);
    }
  };

  const clickEvent = (id) => {
    setSelected(id);
    toggleSideBar();
  };
  return (
    <div
      className={`fixed inset-0 bg-gray-800 p-4 transition-transform tranform md:relative md:translate-x-0 md:w-1/4 md:block ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        className="md:hidden p-2 mb-4 bg-gray-700 rounded text-2xl"
        onClick={toggleSideBar}
      >
        <IoIosCloseCircle />
      </button>

      <div className="text-2xl font-semibold mb-6">ChatBot</div>
      <div className="mb-4">
        <button
          onClick={createChat}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          {createLoad ? <LoadingSpinner /> : "New Chat +"}
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Recent</p>

        <div className="max-h-[500px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar">
          {chats && chats.length > 0 ? (
            chats.map((e) => (
              <button
                key={e._id}
                className="w-full text-left py-2 px-2 bg-gray-700 hover:bg-gray-600 rounded mt-2 flex justify-between items-center"
                onClick={() => clickEvent(e._id)}
              >
                <span>{e.latestMsg.slice(0, 38)}...</span>
                <button
                  className="bg-red-600 hover:bg-red-900 text-white rounded-md text-xl px-3 py-1.5"
                  onClick={() => deleteChatHandler(e._id)}
                >
                  <MdDelete />
                </button>
              </button>
            ))
          ) : (
            <p>No Chats Yet</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 mb-6 w-full">
        <button
          className="bg-red-600 hover:bg-red-900 text-white rounded-md text-xl px-3 py-1.5"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
