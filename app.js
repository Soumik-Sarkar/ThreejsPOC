const express = require("express");
const path = require("path");

const app = express();

app.set("/", "html");
app.use(express.static(path.join(__dirname, "/")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8081, () => {
  console.log("Working!!!!");
});
