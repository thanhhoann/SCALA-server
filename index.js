import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.listen(3001);

const users = [];

const generateRandomPosition = () => [
  Math.floor(Math.random() * 2),
  0,
  Math.floor(Math.random() * 2),
];

io.on("connection", (socket) => {
  console.log(`[SERVER] ${socket.id} ✅`);

  users.push({
    id: socket.id,
    position: generateRandomPosition(),
  });

  io.emit("users", users);

  socket.on("disconnect", () => {
    console.log(`[SERVER] ${socket.id} ❌`);
    users.splice(
      users.findIndex((user) => user.id === socket.id),
      1
    );
    io.emit("users", users);
  });
});
