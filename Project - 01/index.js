const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

// Instance
const app = express();
const port = 8000;

// Middleware
app.use(express.urlencoded({ extended: false }));

// Routes
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
    return res.json({ status: "Succes", id: users.length });
  });
});

/* Grouping same path for different http methods*/
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
    const user = users.find((user) => user.id === id);
    return res.json({ status: "User Deleted", user });
  });

app.listen(8000, () => console.log(`Server started at ${port}`));
