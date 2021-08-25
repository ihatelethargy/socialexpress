const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});

// take userid and socketid from user
let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
    console.log("One user connect");
    //io.emit("welcome", "this is socket server"); // (eventname , message) everyone
    // io.to(si).emit()
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
