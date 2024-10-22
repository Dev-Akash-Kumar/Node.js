const User = require("../models/User");

async function handleGetAllUsers(req, res) {
  const allUsersDB = await User.find({});
  return res.json(allUsersDB);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  return res.json({ msg: "success", user });
}

async function handlePatchByUserId(req, res) {
  await User.findByIdAndUpdate(req.params.id, { firstName: "Changed" });
  return res.json({ msg: "success" });
}

async function handleDeleteById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ msg: "deleted" });
}

async function handleCreateNewUser(req, res) {
  try {
    const body = req.body;
    console.log(body);
    if (
      !body ||
      !body.first_name ||
      !body.last_name ||
      !body.email ||
      !body.gender ||
      !body.jobTitle
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
    return res.status(201).json({ msg: "success", id: result._id });
  } catch (error) {
    console.log("Error creating user:", error);
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handlePatchByUserId,
  handleDeleteById,
  handleCreateNewUser,
};
