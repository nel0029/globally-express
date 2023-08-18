/** @format */

const asyncHandler = require("express-async-handler");
const { Users } = require("../../models/userModel");

const SearchUser = asyncHandler(async (req, res) => {
  const { userName } = req.query;

  if (userName) {
    const user = await Users.find(
      { userName: { $regex: userName, $options: "i" } },
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

    res.status(200).json(user);
  } else {
    res.status(200).json(null);
  }
});

module.exports = SearchUser;
