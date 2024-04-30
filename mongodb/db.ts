import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@linkedinclone.tuw69ga.mongodb.net/?retryWrites=true&w=majority&appName=linkedinClone`;
// const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@linkedin-clone-dhananjaya.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`
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
    console.log("Connecting to MongoDB.......");
    await mongoose.connect(connectionString);
    console.log("-------- Connected to MongoDB ---------");
  } catch (error) {
    console.log("Error connectiong to the MongoDB: ", error);
  }
};

export default connectDB
