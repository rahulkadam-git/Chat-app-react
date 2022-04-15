import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSender } from "../../config/chatLogic";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../Loading/ChatLoading";
import NewChat from "./NewChat";
import jwtDecode from "jwt-decode";

function ChatField({ fetchAgain }) {
  const [loggedIn, setLoggedIn] = useState();
  const { setSelectedChat, chats, setChats,token,user } = ChatState();

  const fetchChats = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:4000/api/chat",
        config
      );

      setChats(data);
    } catch (error) {
      toast.warning("Failed to load the chat", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("token");
    const senderUser = jwtDecode(currentUser)
    setLoggedIn(senderUser)

    setTimeout(()=>{
      fetchChats();
    },2000)
   
  }, [fetchAgain]);

  return (
    <div className="ChatsFeild">
      <div className="new-chat">
        <h5>My Chats</h5>
        <NewChat />
      </div>
      <div className="chat-lists">
        {chats ? (
          <div className="chat-li">
            {chats.map((chat) => (
              <div
                className="user-chat"
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
              >
                <p>
                  {!chat.isGroupChat
                    ? getSender(loggedIn, chat.users)
                    : chat.chatName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
}

export default ChatField;
