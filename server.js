//imports
const cors = require("cors");
const express = require("express");
const { type } = require("express/lib/response");
const { Dirent } = require("fs");
const fs = require("fs/promises");

const { getAllContent, getFileSize, addFileSize } = require("./functions");
//import { getAllContent, getFileSize, addFileSize } from "./functions.js";
const app = express();
const port = 3000;

// le serveur envoie la première vue statique
app.use(express.static("frontend"));
app.use(cors());

// Mes dossiers:
const targetPath = "./randomFolders";

app.get("/api/drive", (req, res) => {
  getAllContent(targetPath)
    /*
    .then((files) => {
      addFileSize(files);
    })*/
    .then((result) => {
      res.send(result);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
