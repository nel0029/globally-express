/** @format */

const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  CreateUserFollow,
} = require("../controllers/UsersController/CreateUserFollow");
const ReadUserDetails = require("../controllers/UsersController/ReadUserDetails");
const DeleteUserFollow = require("../controllers/UsersController/DeleteUserFollow");
const ReadUserFollowing = require("../controllers/UsersController/ReadUserFollowing");
const ReadUserFollowers = require("../controllers/UsersController/ReadUserFollowers");
const SearchUser = require("../controllers/UsersController/SearchUser");
const ReadAccountDetails = require("../controllers/UsersController/ReadAccountDetails");
const UpdateUserAccount = require("../controllers/UsersController/UpdateUserAccount");
const ReadUsersToFollow = require("../controllers/UsersController/ReadUsersToFollow");
const deleteUserPosts = require("../controllers/UsersController/DeleteUserPosts");
const uploadFiles = require("../middleware/uploadFiles");
const uploadAvatarAndCoverPhoto = require("../middleware/uploadAvatarAndCoverPhoto");

router.post("/follow", protect, CreateUserFollow);
router.post("/suggested", protect, ReadUsersToFollow);
router.put(
  "/account/update",
  protect,
  uploadFiles.fields([
    { name: "avatarURL", maxCount: 1 },
    { name: "coverPhotoURL", maxCount: 1 },
  ]),
  uploadAvatarAndCoverPhoto,
  UpdateUserAccount
);

router.delete("/unfollow", protect, DeleteUserFollow);
router.get("/search", protect, SearchUser);
router.get("/account/data/:userID", protect, ReadAccountDetails);
router.get("/:userName", protect, ReadUserDetails);
router.get("/:userName/following", protect, ReadUserFollowing);
router.get("/:userName/followers", protect, ReadUserFollowers);
router.delete("/posts/delete/:userName", deleteUserPosts);

module.exports = router;
