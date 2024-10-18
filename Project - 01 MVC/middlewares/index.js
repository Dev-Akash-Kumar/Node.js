const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    fs.appendFile(
      filename,
      `${req.ip}: ${Date.now()}: ${req.method}: ${req.path}\n`,
      (err, data) => {
        next();
      }
    );
  };
}

module.exports = { logReqRes };
