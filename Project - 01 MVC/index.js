const express = require("express");
const userRouter = require("./routes");
const { connectMongoDB } = require("./connection");
const { logReqRes } = require("./middlewares");

const app = express();
const port = 8000;

/* Connection */
connectMongoDB("mongodb://localhost:27017/app-1MVC");

/* middleware */
app.use(logReqRes("log.txt"));
app.use(express.urlencoded({ extended: false }));

/* routes */
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server started at port ${port}`));
