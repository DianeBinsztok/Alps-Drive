//imports
const cors = require("cors");
const express = require("express");
const { type } = require("express/lib/response");
const { Dirent } = require("fs");
const fs = require("fs/promises");

const app = express();
const port = 3000;

// le serveur envoie la première vue statique
app.use(express.static("frontend"));
app.use(cors());

// Mes dossiers:
const targetPath = "./randomFolders";

// Les fonctions pour aller chercher le contenu de randomFolders
async function getAllContent(contentPath) {
  const results = [];
  const files = await fs.readdir(contentPath, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isDirectory()) {
      results.push({
        name: file.name,
        isFolder: true,
      });
    } else {
      results.push({
        name: file.name,
        isFolder: false,
      });
    }
  });
  return results;
}

// *** La version synchrone qui ne fonctionne pas (même en rendant le callback d'app.get asynchrone)
function getAllContent2(contentPath) {
  fs.readdir(contentPath, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.error(
        "La recherche de vos documents n'a pas fonctionné : ",
        error
      );
    } else {
      console.log("Mes fichiers avant map: ", files);
      files.map((file) => {
        console.log(file);
        if (file.isDirectory()) {
          return {
            name: file.name,
            isFolder: true,
          };
        } else {
          return {
            name: file.name,
            isFolder: false,
            size: 0,
          };
        }
      });
    }
  }).then((documents) => {
    console.log("Mes fichiers après map: ", documents);
    return documents;
  });
}
// ***

app.get("/api/drive", (req, res) => {
  getAllContent(targetPath).then((data) => res.send(data));
  /*const data = getAllContent2(targetPath);
  console.log("J'ai reçu mes données, ou pas?? ", data);
  res.send(data);*/
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
