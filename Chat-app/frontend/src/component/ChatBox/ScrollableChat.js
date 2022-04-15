import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogic";
import { ChatState } from "../../Context/ChatProvider";

function ScrollableChat({ message }) {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {message &&
        message.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {isSameSender(message, m, i, user._id) ||
              isLastMessage(message, m, i, user._id)}

            <span
              style={{
                background: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(message, m, i, user._id),
                marginTop: isSameUser(message, m, i, user._id) ? 3 : 3,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
