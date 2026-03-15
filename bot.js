const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bot running");
});

app.post("/bot", (req, res) => {

  console.log(req.body);

  res.sendStatus(200);

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
