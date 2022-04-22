const cors = require("cors");
const express = require("express");
const app = express();
const port = 8000;

console.log("Le module CORS, c'est ça -> ", cors);
app.use(cors());

app.get("/api/drive", (req, res) => {
  res.send("test");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
