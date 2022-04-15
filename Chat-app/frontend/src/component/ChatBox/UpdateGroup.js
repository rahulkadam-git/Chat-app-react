import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserListItem from "../UserAvatar/UserListItem";
import { faEye, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../../config/chatLogic";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { toast } from "react-toastify";
function UpdateGroup({ fetchMessages, fetchAgain, setFetchAgain }) {
  const { selectedChat, setSelectedChat, user,token } = ChatState();

  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:4000/api/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error("could not rename chat", {
        position: "top-center",
      });
      setRenameLoading(false);
    }
    setGroupChatName(" ");
  };
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only user can remove someone", {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:4000/api/remove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error("Error occured", {
        position: "top-center",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User already in group", {
        position: "top-center",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user1._id) {
      toast.error("Only user can added someone", {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4000/api/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Error accured", {
        position: "top-center",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
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

  return (
    <div>
      <Button variant="secondary" onClick={handleShow}>
        <FontAwesomeIcon icon={faEye} />
      </Button>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            {!selectedChat.isGroupChat ? (
              <h5>{getSender(user, selectedChat.users)}</h5>
            ) : (
              <h5>{selectedChat.chatName.toUpperCase()}</h5>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="listOfusers">
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={user._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>

          {!selectedChat.isGroupChat ? (
            <></>
          ) : (
            <div className="renamechat">
              <input
                placeholder="Rename chat here"
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <button
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Search Users to Chat"
                onClick={handleRename}
                isLoading={renameLoading}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          )}
          <div className="addppl">
            <input
              placeholder="Add people here"
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
              <FontAwesomeIcon icon={faPlus} />
            </button>

            {loading ? (
              <></>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user._id)}
                />
              ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleRemove(user)}>
            Leave group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UpdateGroup;
