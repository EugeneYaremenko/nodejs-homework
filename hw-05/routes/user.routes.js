const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadMiddleware = multer({ storage });

router.post(
  "/auth/register",
  userController.validateCreateUser,
  userController.createUser
);

router.put("/auth/login", userController.validateSingIn, userController.signIn);

router.patch("/auth/logout", userController.authorize, userController.logout);

router.get("/current", userController.authorize, userController.getCurrentUser);

router.patch(
  "/avatars",
  userController.authorize,
  uploadMiddleware.single("file"),
  userController.updateUserAvatar
);

router.use("/images", express.static("./public/images"));

module.exports = router;
