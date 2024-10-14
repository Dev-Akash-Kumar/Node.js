const http = require("http");
const fs = require("fs");
const url = require("url");

function myHandler(req, res) {
  if (req.url === "/favicon.ico") return res.end();
  //  const log = `${Date.now()}\t${req.url}${req.url}: New Req Recieved\n`;
  const log = `${Date.now()}\t${req.method}: New Req Recieved\n`;
  const myUrl = url.parse(req.url, true); // true means parsing query parameters
  // console.log(myUrl);
  fs.appendFile("log.txt", log, (err, data) => {
    //  switch (req.url) {
    switch (myUrl.pathname) {
      case "/":
        //  res.end("HomePage");
        if (req.method === "GET") res.end("HomePage");
        break;
      case "/about":
        //  res.end("I am Akash Kumar");
        const username = myUrl.query.name;
        res.end(`Hi, ${username}`);
        break;
      case "/signup":
        if (req.method === "GET") res.end("This is a signup form");
        else if (req.method === "POST") {
          // DB query
          res.end("Success");
        }
        break;
      default:
        res.end("404 Not Found");
    }
  });
}
// to create server
const myServer = http.createServer(myHandler);
// fuction takes call back(arrow function) to listen incoming requests object - req,res data

// entry point
myServer.listen(8000, () => {
  console.log("server started"); // call-back if our server started without problem
});
