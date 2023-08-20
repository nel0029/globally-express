/** @format */

const asyncHandler = require("express-async-handler");

const logOut = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ isLogIn: false });
});

module.exports = { logOut };
