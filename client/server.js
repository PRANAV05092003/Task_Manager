import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("*", (req, res) => {
  // Do not serve index.html for missing JS/CSS/assets (prevents blank screen)
  if (req.path.startsWith("/assets") || /\.[a-zA-Z0-9]+$/.test(req.path)) {
    return res.status(404).send("Not found");
  }
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend running on ${PORT}`);
});
