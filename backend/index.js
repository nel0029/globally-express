/** @format */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");
const port = process.env.PORT || 5000;
const clientAddress = process.env.CLIENT_ADDRESS;

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: clientAddress,
    credentials: true,
  },
});

app.use(
  cors({
    origin: clientAddress,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(errorHandler);

//For HTTP
app.use("/", require("./routes/postsRoutes"));
app.use("/users", require("./routes/usersRoutes"));
app.use("/auth", require("./routes/userAuthRoutes"));
app.use("/messages", require("./routes/messagesRoutes"));
app.use("/notifications", require("./routes/notificationsRoutes"));
app.use("/explore", require("./routes/searchRoutes"));
//app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//For Sockets
const { ActiveUsers } = require("./models/userModel");
const messageHandler = require("./socket-io/message/message");
const notificationHandler = require("./socket-io/notifications/notification");

io.on("connection", async (socket) => {
  const { userID } = socket.handshake.query;
  const socketID = socket.id;

  messageHandler(io, socket);
  notificationHandler(io, socket);

  if (userID) {
    const activeUserExists = await ActiveUsers.findOne({ userID: userID });

    if (!activeUserExists) {
      const newActiveUser = new ActiveUsers({
        userID: userID,
        socketID: socketID,
      });

      await newActiveUser.save();
    }
  }

  socket.on("disconnect", async () => {
    await ActiveUsers.findOneAndRemove({ userID: userID });
  });
});

server.listen(port, () => console.log(`Running on port ${port}`));
