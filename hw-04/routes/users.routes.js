const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/users.controller");

router.post(
  "/auth/register",
  UsersController.validateCreateUser,
  UsersController.createUser
);

router.put(
  "/auth/login",
  UsersController.validateSingIn,
  UsersController.signIn
);

router.patch("/auth/logout", UsersController.authorize, UsersController.logout);

router.get(
  "/users/current",
  UsersController.authorize,
  UsersController.getCurrentUser
);

module.exports = router;
