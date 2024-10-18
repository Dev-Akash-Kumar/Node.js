const mongoose = require("mongoose");

async function connectMongoDB(URL) {
  mongoose.connect(URL).then(() => console.log("MongoDB Connected"));
}

module.exports = { connectMongoDB };
