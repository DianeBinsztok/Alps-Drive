//const { Dirent } = require("fs");
import { Dirent } from "fs";
//const fs = require("fs/promises");
import fs from "fs/promises";

// Version de Victor:
export async function listerFichiers(path) {
  const response = [];
  const files = await fs.readdir(path, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      response.push({
        name: file.name,
        isFolder: file.isDirectory(),
      });
    } else {
      const stats = await fs.stat(path + file.name);
      response.push({
        name: file.name,
        size: stats.size,
        isFolder: false,
      });
    }
  }

  return response;
}
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
export function getOneContent(file, path) {
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
export async function getAllContent2(contentPath) {
  const results = [];
  await fs.readdir(contentPath, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.error(
        "La recherche de vos documents n'a pas fonctionné : ",
        error
      );
    } else {
      debugger;
      console.log("Mes fichiers avant map: ", files);
      files.map((file) => {
        console.log(file);
        if (file.isDirectory()) {
          debugger;
          results.push({
            name: file.name,
            isFolder: true,
          });
        } else {
          debugger;
          results.push({
            name: file.name,
            isFolder: false,
            size: 0,
          });
        }
        debugger;
      });
    }
  });
  return results;
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

// Nouvelle version :
export async function getAllDocuments(path) {
  const results = [];
  const files = await fs.readdir(path, { withFileTypes: true });
  // await ne fonctionne pas dans un map()!
  for (let file of files) {
    if (file.isDirectory()) {
      results.push({
        name: file.name,
        isFolder: true,
      });
    } else {
      const fileStats = await fs.stat(path + "/" + file.name);
      results.push({
        name: file.name,
        isFolder: false,
        size: fileStats.size,
      });
    }
  }
  return results;
}
//Point sur l'asynchronicité:
//1 - avec des callbacks:
export function getWithCallbacks(path, callback) {
  const result = fs.readdir(path, { withFileTypes: true }).then((result) => {
    callback(result);
  });
  console.log("1 - Result before callback treatment: ", result);
  return result;
}
// callback de test
export function callbackTest(data) {
  console.log("2 - Result after callback treatment:  ", data);
}

// callback pour mapper les fichiers
export function dispatchFilesAsCallback(files) {
  console.log("2 - Results when entering dispatch callback: ", files);
  const results = [];
  for (let file of files) {
    if (file.isDirectory()) {
      results.push({
        name: file.name,
        isFolder: true,
      });
    } else {
      results.push({
        name: file.name,
        isFolder: false,
        size: 0,
      });
    }
  }
  console.log("3 - Results mapped in callback: ", results);
  return results;
}

// 2 - avec des promesses:
export function getWithThenCatch(path) {}
export function getWithTryCatch(path) {}
export function getWithAsyncAwait(path) {}

// II - Aller chercher un document:
export async function getOneDocument(path, filename) {
  let documents = await getAllDocuments(path);
  console.log("All my documents : ", documents);

  let target = documents.find((document) => document.name == filename);
  console.log("My requested document : ", target);
  if (target.isFolder) {
    return getAllDocuments(path + "/" + filename);
  } else {
    fs.readFile(path + "/" + filename)
      .then((file) => {
        console.log("My file : ", file);
        return file;
      })
      .catch((error) => {
        console.error("Impossible d'ouvrir le ficher : ", error);
      });
  }

  /*
  fs.readdir(path + "/" + filename, { withFileTypes: true }).then((result) => {
    console.log("result of fs.readdir : ", result);
    console.log("result's type = ", typeof result);
    if (typeof result == "object") {
      console.log("Result est un objet");
      return getAllDocuments(path + "/" + filename);
    } else {
      console.log("Result est un fichier");
      fs.readFile(path + "/" + filename, "utf-8").then((file) => {
        return file;
      });
    }
  });
  */
}
