//imports
const cors = require("cors");
const express = require("express");
const fs = require("fs/promises");

const app = express();
const port = 3000;

// le serveur envoie la première vue statique
app.use(express.static("frontend"));
app.use(cors());
console.log("Le module CORS, c'est ça -> ", cors);

/*app.get("/", (req, res) => {
  res.send("Welcome");
});*/

app.get("/api/drive", (req, res) => {
  res.send("Welcome");
});

app.post("/api/drive/:name", (req, res) => {
  const foldername = req.params.name;
  if (!foldername) {
    res.end();
  } else {
    fs.mkdir(foldername)
      .then(() => {
        console.log("Y'a ça dans foldername -> ", foldername);
        res.sendStatus(201);
      })
      .catch((error) => {
        console.error("La création du dossier a échoué: ", error);
        res.sendStatus(500);
      });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
