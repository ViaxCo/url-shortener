import mongoose from "mongoose";

// Use a different database depending on the environment
const db =
  process.env.NODE_ENV === "test"
    ? process.env.DB_TEST_NAME
    : process.env.DB_NAME;

// Use a different uri depending on the environment
const uri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_TEST_URI
    : process.env.MONGO_URI;

const connectDB = async () => {
  if (!uri) {
    console.error("No uri found");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`CONNECTED to ${db} on: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
