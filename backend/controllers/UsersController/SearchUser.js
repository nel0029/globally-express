/** @format */

const asyncHandler = require("express-async-handler");
const { Users } = require("../../models/userModel");

const SearchUser = asyncHandler(async (req, res) => {
  const { userName, requesterUserName } = req.query;

  if (userName) {
    const users = await Users.find(
      {
        $and: [
          { userName: { $regex: userName, $options: "i" } },
          { userName: { $ne: requesterUserName } },
        ],
      },
      {
        _id: 1,
        userName: 1,
        userFirstName: 1,
        userMiddleName: 1,
        userLastName: 1,
        avatarURL: 1,
        verified: 1,
      }
    );
    res.status(200).json(users);
  } else {
    res.status(200).json(null);
  }
});

module.exports = SearchUser;
