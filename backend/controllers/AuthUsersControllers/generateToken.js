/** @format */

const jwt = require("jsonwebtoken");

// Generate JWT

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.HTTP_ONLY_SECURE,
    sameSite: process.env.HTTP_ONLY_SAME_SITE,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

module.exports = {
  generateToken,
};
