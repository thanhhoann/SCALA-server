import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.listen(3001);

const users = [];

const generateRandomPosition = () => [Math.random() * 3, 0, Math.random() * 3];

io.on("connection", (socket) => {
  console.log(`[SERVER] ${socket.id} ✅`);

  io.emit("user_id", socket.id);
  io.emit("user_position", generateRandomPosition());

  users.push({
    id: socket.id,
    position: generateRandomPosition(),
  });
  io.emit("users", users);

  socket.on("move", (position) => {
    const user = users.find((user) => user.id === socket.id);
    user.position = position;
    io.emit("users", users);
  });

  socket.on("disconnect", () => {
    console.log(`[SERVER] ${socket.id} ❌`);
    users.splice(
      users.findIndex((user) => user.id === socket.id),
      1
    );
    io.emit("users", users);
  });
});
