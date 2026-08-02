"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));
app.use(express_1.default.json());
app.use("/chat", chat_routes_1.default);
// Serve frontend build
const frontendPath = path_1.default.join(__dirname, "..", "dist");
console.log("Serving frontend from:", frontendPath);
app.use(express_1.default.static(frontendPath));
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(frontendPath, "index.html"));
});
exports.default = app;
