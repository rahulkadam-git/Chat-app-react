import React from "react";
import SideDrawer from "./SideDrawer";
import { ChatState } from "../../Context/ChatProvider";
import ChatField from "./ChatField";

function MyChats({fetchAgain}) {
  const { user } = ChatState();

  
  return (
    <div className="sidebar-container">
      <div className="sidebar">{user && <SideDrawer />}</div>
      <div className="chats"> {user && <ChatField fetchAgain={fetchAgain} />}</div>
    </div>
  );
}

export default MyChats;
