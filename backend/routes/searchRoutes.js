/** @format */

const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const searchPostsByWord = require("../controllers/SearchControllers/SearchPostsByWord");
const readAllHashtags = require("../controllers/SearchControllers/ReadAllHashtags");

router.get("/search/trends", protect, readAllHashtags);
router.get("/search/posts", protect, searchPostsByWord);

module.exports = router;
