const express = require("express");
const socketio = require("socket.io")
const path = require("path")
const http = require("http")
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)
const io = socketio(server)

server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});


app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))
app.get('/', (req, res) => {
    res.render("index")
})
io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data })
    })
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    })
})

// server.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
// }); 
