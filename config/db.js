const mongoose = require("mongoose");

let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Connected to MongoDB");
        return mongoose.connection;
      })
      .catch((err) => {
        connectionPromise = null;
        console.error("MongoDB connection failed:", err.message);
        throw err;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
