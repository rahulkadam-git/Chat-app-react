import React, { useEffect, useState } from "react";
import { getSender } from "../../config/chatLogic";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../../component/Loading/ChatLoading";
import axios from "axios";
import { toast } from "react-toastify";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import UpdateGroup from "./UpdateGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Lottie from "react-lottie";
import animationData from "../../Animations/88136-typing.json";

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [message, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    token,
  } = ChatState();

  const fetchMessage = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:4000/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to load messages ", {
        position: "top-center",
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.post(
          "http://localhost:4000/api/message/",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);

        setNewMessage("");
        setMessages([...message, data]);
      } catch (error) {
        toast.error("Failed to send message", {
          position: "top-center",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessage();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        console.log(selectedChatCompare);
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          console.log(notification)
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...message, newMessageReceived]);
        
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className="chat-screen">
      <div className="chat-header">
        {selectedChat ? (
          <div className="chat-heading">
            <div className="back">
              <FontAwesomeIcon
                onClick={() => setSelectedChat("")}
                icon={faArrowLeft}
              />
            </div>

            {!selectedChat.isGroupChat ? (
              <>{getSender(user, selectedChat.users)}</>
            ) : (
              <>
                <>{selectedChat.chatName.toUpperCase()}</>
                <UpdateGroup
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </div>
        ) : (
          <div>Click on user to start chatting</div>
        )}
      </div>
      <div className="chat-window">
        {loading ? <ChatLoading /> : <></>}
        <div className="messages">
          <ScrollableChat message={message} />
          {isTyping ? (
            <div className="type">
              <Lottie
                options={defaultOptions}
                height={50}
                width={80}
                style={{ marginBottom: 15, marginLeft: 0 }}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <div className="typing-field">
          <div className="form-group" onKeyDown={sendMessage}>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="type message here"
              onChange={typingHandler}
              value={newMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleChat;
