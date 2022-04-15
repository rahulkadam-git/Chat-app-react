import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../Loading/ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

function SideDrawer(props) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, setSelectedChat, chats, setChats,token } = ChatState();
  const history = useHistory();

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter something in search", {
        position: "top-center",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:4000/api/auth/allusers?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast("Error Occured", { position: "top-center" });
    }
  };

  const accessChat = async (userId) => {
   
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/chat",
        { userId },
        config
      );
     
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toast.warning("Error fecting the chat", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
    <div className="sidebar-main">
        <div className="Search-box">
          <div className="input-search">
            <input
              placeholder="Search here by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="button"
              className="btn btn-secondary"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Search Users to Chat"
              onClick={handleSearch}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {loading ? (
          <ChatLoading />
        ) : (
          searchResult?.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}

        {loadingChat && <ChatLoading />}
      </div>
     
    </div>
  );
}

export default SideDrawer;
