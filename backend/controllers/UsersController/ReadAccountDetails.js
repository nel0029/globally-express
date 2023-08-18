/** @format */

const asyncHandler = require("express-async-handler");
const { Users, Following } = require("../../models/userModel");
const { ObjectId } = require("mongodb");
const basePath = process.env.BASE_PATH;

const ReadAccountSettings = asyncHandler(async (req, res) => {
  const { userID } = req.params;

  const accountDetails = await Users.findById(userID, {
    _id: 0,
    userID: "$_id",
    userFirstName: 1,
    userMiddleName: 1,
    userLastName: 1,
    userName: 1,
    avatarURL: 1,
    coverPhotoURL: 1,
    verified: 1,
    bio: 1,
    email: 1,
  });

  res.status(200).json(accountDetails);
});

module.exports = ReadAccountSettings;
