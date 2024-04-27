import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@linkedinclone.tuw69ga.mongodb.net/`;
// mongodb+srv://username:EY3t3Trvts9AKLp@linkedinclone.tuw69ga.mongodb.net/
if (!connectionString) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside env.local"
  );
}

const connectDB = async () => {
  if (mongoose.connection?.readyState >= 1) {
    return;
  }

  try {
    console.log("-------- Connecting to MongoDB ---------");
    await mongoose.connect(connectionString);
  } catch (error) {
    console.log("Error connectiong to the MongoDB: ", error);
  }
};

export default connectDB
