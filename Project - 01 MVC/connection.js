const mongoose = require("mongoose");

async function connectMongoDB(URL) {
  mongoose
    .connect(URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
}

module.exports = { connectMongoDB };
