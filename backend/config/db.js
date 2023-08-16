/** @format */

const moongose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await moongose.connect(process.env.MONGO_URI);

    console.log(`Connected DB: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
