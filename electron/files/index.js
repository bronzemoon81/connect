const fs = require("fs");
const path = require("path");

async function listFilesInFolder(folderPath = "") {
  if (path) {
    try {
      const files = fs.readdirSync(folderPath);
      const filteredFiles = files.filter((fileName) => {
        const fileExtension = path.extname(fileName).toLowerCase().slice(1); // Dosya uzantısını al
        return ["png", "jpeg", "jpg"].includes(fileExtension);
      });
      const fileList = filteredFiles.map((fileName) => {
        const filePath = path.join(folderPath, fileName);
        const stats = fs.statSync(filePath);
        console.log("tarih=", new Date(stats.mtime).toDateString());
        return {
          name: fileName,
          path: filePath,
          size: stats.size,
          // isDirectory: stats.isDirectory(),
          updated_at: new Date(stats.mtime).toDateString(), // Güncellenme tarihi
          extension: path.extname(fileName).toLowerCase().slice(1),
          code: fileName.split("-")[0],
        };
      });
      return fileList;
    } catch (error) {
      console.error("Error listing files:", error);
      return [];
    }
  }
}

async function getFileBlob(filePath = "") {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const blob = new Blob([data], { type: "image/jpeg" }); // Dosya türüne göre ayarlayabilirsiniz
        resolve(blob);
      }
    });
  });
}
export default async function () {
  return {
    listFilesInFolder: listFilesInFolder,
    getFileBlob: getFileBlob,
  };
}
