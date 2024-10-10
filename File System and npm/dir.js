const fs = require("fs");
const path = require("path");

// delete dir if exists
if (fs.existsSync("dir-operations")) {
  fs.rmdir("dir-operations", (err) => {
    if (err) throw err;
    console.log("dir deleted");
  });
} else {
  console.log("dir doesn't exists");
}

// create dir if doesn't exists
if (!fs.existsSync("dir-operations")) {
  fs.mkdir("dir-operations", (err) => {
    if (err) throw err;
    console.log("dir created");
  });
} else {
  console.log("dir already exists");
}

process.on("uncaughtException", (err) => {
  console.log(`Uncaught exception ${err}`);
});
