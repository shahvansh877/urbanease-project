const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://urbanease-final.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/providers", require("./routes/providers"));
app.use("/api/bookings", require("./routes/bookings"));

app.get("/", (req, res) => {
  res.send("UrbanEase Backend Running 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "UrbanEase API is running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});