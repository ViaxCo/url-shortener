import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("No uri found");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `CONNECTED to ${conn.connection.db.databaseName} on: ${conn.connection.host}`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
