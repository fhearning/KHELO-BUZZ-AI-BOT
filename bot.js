const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bot running");
});

app.post("/bot", (req, res) => {

  try {

    const update = req.body;

    console.log("Update:", update);

    res.sendStatus(200);

  } catch (err) {

    console.log("ERROR:", err);
    res.sendStatus(200);

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port " + PORT);
});
