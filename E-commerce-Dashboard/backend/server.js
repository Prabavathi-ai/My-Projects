const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make io accessible to routes
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/analytics", require("./routes/analyticsRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("ShopSphere Backend Running");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 3000;

// ✅ THIS LINE IS CRITICAL
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
