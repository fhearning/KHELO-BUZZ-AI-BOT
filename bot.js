const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.post("/bot", (req, res) => {

  console.log("Webhook received:", req.body);

  res.status(200).send("ok");

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
