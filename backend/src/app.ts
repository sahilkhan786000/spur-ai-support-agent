import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";
import path from "path";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use("/chat", chatRoutes);

// Serve frontend build
const frontendPath = path.join(
  __dirname,
  "..",
  "dist"
);
console.log("Serving frontend from:", frontendPath);
app.use(express.static(frontendPath));


app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
