/** @format */

const express = require("express");
const router = express.Router();

const {
  registerUser,
} = require("../controllers/AuthUsersControllers/registerUserController");
const {
  logInUser,
} = require("../controllers/AuthUsersControllers/logInUserController");
const { logOut } = require("../controllers/AuthUsersControllers/logOut");
const verifyUserName = require("../controllers/AuthUsersControllers/verifyUserName");

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", logOut);
router.get("/verify/username", verifyUserName);

module.exports = router;
