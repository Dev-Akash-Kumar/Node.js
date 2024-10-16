const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");
const { type } = require("os");
const { stringify } = require("querystring");

/* Instance */
const app = express();

const port = 8000;

/* To connect mongoDB */
mongoose
  .connect("mongodb://localhost:27017/app-1")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));

/* Schema */
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
  },
  gender: {
    type: String,
  },
});

/* Model */
const user = mongoose.model("user", userSchema);

/* Middleware - parses URL-encoded data and makes it available in req.body */
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Hello from middleware 1");
  req.myUserName = "akash kumar"; // modifying req
  // return res.json({ msg: "Hello from middleware 1" });
  next();
});

app.use((req, res, next) => {
  console.log("Hello from middleware 2", req.myUserName);
  // creating a log file in middleware
  // fs.appendFile("log.txt",`${Date.now()}: ${req.method}: ${re.path}`)
  fs.appendFile(
    "log.txt",
    `${req.ip}: ${Date.now()}: ${req.method}: ${req.path}\n`,
    (err, data) => {
      // return res.end("hey");
      next();
    }
  );
});

/* Routes - SSR */
app.get("/users", (req, res) => {
  const html = `
      <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
      </ul>
      `;
  res.send(html);
});

/* REST API Start */

/* To get all users data */
app.get("/api/users", (req, res) => {
  // getting req header
  console.log(req.headers);
  // setting res headers
  res.setHeader("X-myname", "Akash Kumar"); // custom header
  console.log("I'm in GET route", req.myUserName);
  return res.json(users);
});

/* To get user with id */
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  // to find the user with dynamic path parameter id using find()
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

/* To create a new user */
app.post("/api/users", (req, res) => {
  const body = req.body;
  console.log("body", body); // undefined as express don't know what type of data coming
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "Succes", id: users.length });
  });
});

/* Grouping same path for different http methods */
app
  .route("/api/users/:id")
  /* To get the user with id */
  .get((req, res) => {
    const id = Number(req.params.id);
    // to find the user with dynamic path parameter id using find()
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  /* To Update the user with id */
  .patch((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    (user.first_name = "Akash"), (user.last_name = "Kumar");
    return res.json({ status: "user update", user });
  })
  /* To Delete the user with id */
  .delete((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    const deletedUser = users.splice(userIndex, 1)[0];
    return res.json({ status: "User Deleted", deletedUser });
  });

app.listen(8000, () => console.log(`Server started at ${port}`));
