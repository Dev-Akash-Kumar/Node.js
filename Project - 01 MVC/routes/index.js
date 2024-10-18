const express = require("express");
const router = express.Router();
const {
  handleGetAllUsers,
  handleGetUserById,
  handlePatchByUserId,
  handleDeleteById,
  handleCreateNewUser,
} = require("../controllers/user");

router
  .route("/")
  /* To get all users */
  .get(handleGetAllUsers)
  /* To create a new user */
  .post(handleCreateNewUser);

router
  .route("/:id")
  /* To get the user with id */
  .get(handleGetUserById)
  /* To Update the user with id */
  .patch(handlePatchByUserId)
  /* To Delete the user with id */
  .delete(handleDeleteById);

module.exports = router;
