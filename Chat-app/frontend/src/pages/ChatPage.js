import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import ChatBox from "../component/ChatBox/ChatBox";
import MyChats from "../component/ChatBox/MyChats";
import Navbar from "../component/ChatBox/Navbar";
import jwt_decode from "jwt-decode";

function ChatPage() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, setUser, token, slider } = ChatState();

  useEffect(() => {
    //const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (token) {
      const userInfo = jwt_decode(token);
      setUser(userInfo);
    }
  }, [token]);

  return (
    <div className="chatPage">
      {user && <Navbar />}
      <div className="main-box">
        {slider ? <>{user && (<MyChats fetchAgain={fetchAgain} />)}</> : <></>}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
}

export default ChatPage;
