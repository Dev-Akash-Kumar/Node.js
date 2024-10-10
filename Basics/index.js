const os = require("os");
const path = require("path");

console.log("hello world");

// os info
console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log(__dirname); // path from root to dir
console.log(__filename); // path from root with file name

console.log(path.dirname(__filename)); // path from root to dir
console.log(path.basename(__filename)); // file name with ext
console.log(path.extname(__filename)); // ext with .
console.log(path.parse(__filename)); // object containing: root, dir, base, ext, name
