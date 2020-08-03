import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "likes",
    },
  ],
  color: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", UserSchema);
