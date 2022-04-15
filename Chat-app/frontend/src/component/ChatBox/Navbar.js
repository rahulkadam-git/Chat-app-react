import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { getSender } from "../../config/chatLogic";
import { ChatState } from "../../Context/ChatProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell ,faBars } from "@fortawesome/free-solid-svg-icons";

function Navbar(props) {
  const { user, notification, setNotification, setSelectedChat ,setToken,slider,setSlider} = ChatState();


  const [open, setOpen] = useState(false);

  const history = useHistory();
//console.log(token)
  const logoutHandle = () => {
  
    localStorage.removeItem("token");
  setToken("");
  
    history.push("/");
  };
  return (
    <div className="navbar">
      <div className="logo">
        <FontAwesomeIcon className="menu-bars" icon={faBars} onClick={()=>setSlider(!slider)} />
        <p className="title">Messanger</p>
      </div>
      <div className="notification-bell">
        <button className="btn btn-secondary" onClick={() => setOpen(!open)}>
          <FontAwesomeIcon icon={faBell} />

          {!notification.length ? (
            <div></div>
          ) : (
            <div className="notify-indicator"></div>
          )}
        </button>

        {open && (
          <div className="notifications">
            {!notification.length && "No new Message"}
            {notification.map((notify) => (
              <div
                className="notifications-list"
                onClick={() => {
                  setSelectedChat(notify.chat);
                  setNotification(notification.filter((n) => n !== notify));
                }}
                key={notify._id}
              >
                {notify.chat.isGruopChat
                  ? `New Message in ${notify.chat.chatName}`
                  : `New Message from ${getSender(user, notify.chat.users)}`}
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-secondary logout" onClick={logoutHandle}>
          <div className="userprofile-btn">
            <div className="profile_pic">
              <img src={user.profile_pic} alt="profile_pic" />
            </div>
            <div className="profileDetails">{user.username}</div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
