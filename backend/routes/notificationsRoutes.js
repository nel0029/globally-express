/** @format */

const express = require("express");
const router = express.Router();

const readAllNotifications = require("../controllers/NotificationsControllers/readAllNotifications");
const readUnseenNotifications = require("../controllers/NotificationsControllers/readUnseenNotifications");
const updatedNotification = require("../controllers/NotificationsControllers/updateNotification");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, readAllNotifications);
router.get("/:userID", protect, readUnseenNotifications);
router.put("/update", protect, updatedNotification);

module.exports = router;
