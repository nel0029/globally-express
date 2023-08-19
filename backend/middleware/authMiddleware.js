/** @format */

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { Users } = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.token;
  if (token) {
    try {
      // Get token from header

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await Users.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    res
      .status(401)
      .json({ message: "No token generated because you are not authorized" });
  }
});

module.exports = {
  protect,
};
