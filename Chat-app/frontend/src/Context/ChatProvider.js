import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import isEmpty from "../component/isEmpty";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [token, setToken] = useState("");
  const [slider,setSlider] = useState(false);

  const history = useHistory();
  const localStorageToken = localStorage.getItem("token");

  useEffect(() => {
    //const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (token || localStorageToken) {
      const userInfo = jwt_decode(token || localStorageToken);

      setUser(userInfo);

      if (localStorageToken) {
        setToken(localStorageToken);
      }
    } else {
      history.push("/");
    }
  }, [history, localStorageToken]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        setNotification,
        notification,
        token,
        setToken,
        slider,
        setSlider
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
