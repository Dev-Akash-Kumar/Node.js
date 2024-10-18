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
const User = mongoose.model("user", userSchema);

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
/*
app.get("/users", (req, res) => {
  const html = `
      <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
      </ul>
      `;
  res.send(html);
});
*/
app.get("/users", async (req, res) => {
  const allUsersDBs = await User.find({});
  const html = `
  <ul> ${allUsersDBs.map((user) => `<li>${user.firstName}-${user.email}`)}
  </ul>
  `;
  res.send(html);
});
/* REST API Start */

/* To get all users data */
/*
app.get("/api/users", (req, res) => {
  // getting req header
  console.log(req.headers);
  // setting res headers
  res.setHeader("X-myname", "Akash Kumar"); // custom header
  console.log("I'm in GET route", req.myUserName);
  return res.json(users);
});
*/
app.get("/api/users", (req, res) => {
  const allUsersDB = User.find({});
  return res.json(users);
});

/* To get user with id */
/*
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  // to find the user with dynamic path parameter id using find()
  const user = users.find((user) => user.id === id);
  return res.json(user);
});
*/

/* Creating user in DB */
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "all fields are req.." });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  console.log("result", result);
  return res.status(201).json({ msg: "success" });
});

/* To create a new user */
/*
app.post("/api/users", (req, res) => {
  const body = req.body;
  console.log("body", body); // undefined as express don't know what type of data coming
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "Succes", id: users.length });
  });
});
*/

/* Grouping same path for different http methods */
app
  .route("/api/users/:id")
  /* To get the user with id */
  .get(async (req, res) => {
    /*
    const id = Number(req.params.id);
    // to find the user with dynamic path parameter id using find()
    const user = users.find((user) => user.id === id);
    */
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    return res.json({ msg: "success", user });
  })
  /* To Update the user with id */
  .patch(async (req, res) => {
    /*
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    (user.first_name = "Akash"), (user.last_name = "Kumar");
    return res.json({ status: "user update", user });
    */
    await User.findByIdAndUpdate(req.params.id, { firstName: "Changed" });
    return res.json({ msg: "success" });
  })
  /* To Delete the user with id */
  .delete(async (req, res) => {
    /*
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    const deletedUser = users.splice(userIndex, 1)[0];
    return res.json({ status: "User Deleted", deletedUser });
    */
    await User.findByIdAndDelete(req.params.id);
    return res.json({ msg: "deleted" });
  });

app.listen(8000, () => console.log(`Server started at ${port}`));
