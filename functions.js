//const { Dirent } = require("fs");
import { Dirent } from "fs";
//const fs = require("fs/promises");
import fs from "fs/promises";

// Aller chercher tous les dossiers avec fs.readdir, puis map sur les dossier en appelant getOneContent()
export function getAllContent(contentPath) {
  return fs.readdir(contentPath, { withFileTypes: true }).then((files) => {
    console.log("je map sur un fichier: ", files);
    return (
      Promise.all(
        files.map((file) => {
          const results = getOneContent(file, contentPath);
          return results;
        })
      )
        // juste pour voir avant de return
        .then((results) => {
          console.log("results : ", results);
          return results;
        })
    );
  });
}
// Aller chercher les propriété d'un document avec fs.stats
function getOneContent(file, path) {
  if (file.isDirectory()) {
    return {
      name: file.name,
      isFolder: true,
    };
  } else {
    return fs.stat(path + "/" + file.name).then((stats) => {
      return {
        name: file.name,
        size: stats.size,
        isFolder: false,
      };
    });
  }
}
//La version synchrone qui ne fonctionne pas (même en rendant le callback d'app.get asynchrone)
export function getAllContent2(contentPath) {
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
// Aller chercher la stat size de chaque fichier
export async function getFileSize(filePath) {
  const fileSize = await fs.stat(filePath);
  return fileSize.size;
}
// Reparcourir les documents et ajouter la prop size au besoin
export async function addFileSize(files, contentPath) {
  files.forEach(async (file) => {
    if (!file.isFolder) {
      await fs
        .stat(contentPath + "/" + file.name)
        .then((stats) => {
          console.log(
            "1 - fs.stats doit me retourner les stats, notamment size -> ",
            stats.size
          );
          file.size = stats.size;
          console.log(
            "2 - Je devrais avoir une nouvelle valeur pour file.size -> ",
            file.size
          );
          return file.size;
        })
        .then((fileSize) => {
          return fileSize;
        });
    }
    console.log("3 - addFileSize doit me retourner file.size: ", file.size);
    return file.size;
  });
  console.log("4 - ma liste de documents devrait être modifiée ->", files);
  return files;
}
