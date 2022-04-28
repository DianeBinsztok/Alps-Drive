//imports
//const cors = require("cors");
import cors from "cors";
//const express = require("express");
import express from "express";

//const { getAllContent, getFileSize, addFileSize } = require("./functions");
import { getAllDocuments, getOneDocument } from "./functions.js";
const app = express();
const port = 3000;

// le serveur envoie la première vue statique
app.use(express.static("frontend"));
app.use(cors());

// Mes dossiers:
const targetPath = "./randomFolders";

app.get("/api/drive", (req, res) => {
  getAllDocuments(targetPath).then((result) => {
    console.log("results : ", result);
    res.send(result);
  });
});

app.get("/api/drive/:name", (req, res) => {
  getOneDocument(targetPath, req.params.name).then((result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
