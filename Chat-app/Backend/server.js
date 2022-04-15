const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/db");

const port = 4000;

const app = express();

app.use(express.json());
app.use(cors());
dbConnection();

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/chat.routes"));
app.use("/api/message", require("./routes/message.routes"));

const server = app.listen(port, () => {
  console.log(`server running on ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {

    console.log(newMessageReceived)
    var chat = newMessageReceived.chat;
   

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});
