import mongoose from "mongoose";
import Recipe from "./Recipe";
require("dotenv").config();
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
      console.log(`Mongo connected`);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
