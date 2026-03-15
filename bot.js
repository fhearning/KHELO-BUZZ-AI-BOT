const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot running successfully");
});

app.post("/bot", (req, res) => {
  console.log("Webhook:", req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port " + PORT);
});
