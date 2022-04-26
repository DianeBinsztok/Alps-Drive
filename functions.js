// Aller chercher le contenu de randomFolders
async function getAllContent(contentPath) {
  const results = [];
  const files = await fs.readdir(contentPath, { withFileTypes: true });

  files.map(async (file) => {
    if (file.isDirectory()) {
      results.push({
        name: file.name,
        isFolder: true,
      });
    } else {
      results.push({
        name: file.name,
        size: 0,
        isFolder: false,
      });
    }
  });

  console.log("Résultat de getAllContent: ", results);
  return results;
}
//La version synchrone qui ne fonctionne pas (même en rendant le callback d'app.get asynchrone)
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
// Aller chercher la stat size de chaque fichier
async function getFileSize(filePath) {
  const fileSize = await fs.stat(filePath);
  return fileSize.size;
}
// Reparcourir les documents et ajouter la prop size au besoin
async function addFileSize(files, contentPath) {
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
