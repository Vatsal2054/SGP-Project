import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/AiFinder", {
      useNewUrlParser: true,
    });
    console.log('MongoDB Connected..');
  } catch (error) {
    console.log("Connection failed.");
    console.error(error.message);
    process.exit(1);
  }
}

export default connectDB;