/** @format */

const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const searchPostsByWord = require("../controllers/SearchControllers/SearchPostsByWord");
const readAllHashtags = require("../controllers/SearchControllers/ReadAllHashtags");
const searchWords = require("../controllers/SearchControllers/SearchWords");
const searchKeyWords = require("../controllers/SearchControllers/SearchKeyWords");
const searchUsersByWords = require("../controllers/SearchControllers/SearchUserByWords");

router.get("/search/trends", protect, readAllHashtags);
router.get("/search/posts", protect, searchPostsByWord);
router.get("/search/word", protect, searchWords);
router.get("/search/keywords", protect, searchKeyWords);
router.get("/search/users", protect, searchUsersByWords);

module.exports = router;
