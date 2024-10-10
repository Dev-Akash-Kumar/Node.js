const fs = require("fs");
const path = require("path");

let data = "my name is akash!!";
// write file if doesn;t exists create one - passing data
fs.writeFile(path.join(__dirname, "fileCreated.txt"), data, (err) => {
  if (err) throw err;
  console.log(data);
  console.log("Write file if don't exists create and write");
});

// reading file - getting data
fs.readFile(path.join(__dirname, "fileCreated.txt"), (err, data) => {
  if (err) throw err;
  console.log(`reading file data: ${data}`);
});

// updating file - passing new data
let newData = "\nMy name is Shaurya!!";
fs.appendFile(path.join(__dirname, "fileCreated.txt"), newData, (err) => {
  if (err) throw err;
  console.log("Updating file data");
});

// deleting file
fs.unlink(path.join(__dirname, "fileCreated.txt"), (err) => {
  if (err) throw err;
  console.log("file deleted");
});

process.on("uncaughtException", (err) => {
  console.log(`unexpected error:${err}`);
});
