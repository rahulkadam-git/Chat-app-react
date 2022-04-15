import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
function NewChat(props) {
  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats,token } = ChatState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = async (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warning("user already added", {
        position: "top-center",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
        `http://localhost:4000/api/auth/allusers?search=${search}`,
        config
      );
    
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error occur", {
        position: "top-center",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warning("Please fill all the details", {
        position: "top-center",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      
      setChats([data, ...chats]);
        
      toast.success("New Group chat created", {
        position: "top-center",
      });
    } catch (error) {
      toast.warning("Failed to Create the Chat!", {
        position: "top-center",
      });
    }
  };
  return (
    <div>
      <Button variant="secondary" onClick={handleShow}>
        New chat
      </Button>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create a group chat </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Group name</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter groupname"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Add users</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Add users"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="userCount text-black">{selectedUsers.length}</div>
            </div>
            <div className="addeduserList">
              {selectedUsers.map((u,index) => (
                <UserBadgeItem
                  key={index}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>
          </form>

          {loading ? (
            // <ChatLoading />
            <div>Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user,index) => (
                <UserListItem
                  key={index}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            create chat
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NewChat;
