//imports
const cors = require("cors");
const express = require("express");
const fs = require("fs/promises");

const app = express();
const port = 3000;

// le serveur envoie la première vue statique
app.use(express.static("frontend"));
app.use(cors());

// Mes dossiers:
const targetPath = "./randomFolders";

// Les fonctions pour aller chercher le contenu de randomFolders
function getAllContent(contentPath) {
  fs.readdir(contentPath, { withFileTypes: true }, (error, result) => {
    if (error) {
      console.error("readdir n'a pas fonctionné : ", error);
    } else {
      console.log("Je suis sensée recevoir des dossiers : ", result);
    }
    return result;
  }).then((files) => {
    console.log(files);
    files.map((file) => {
      console.log(file);
    });
  });
}

app.get("/api/drive", (req, res) => {
  getAllContent(targetPath);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
