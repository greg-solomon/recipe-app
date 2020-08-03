import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  source: {
    type: { uid: String || null, displayName: String },
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  dietLabels: {
    type: [String],
    required: true,
  },
  healthLabels: {
    type: [String],
    required: true,
  },
  cautions: {
    type: [String],
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  directions: {
    type: [String],
    required: false,
  },
  calories: {
    type: Number,
    required: false,
  },
  user_uploaded: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  likes: [
    {
      type: String,
      required: true,
    },
  ],
});

export default mongoose.model("Recipe", RecipeSchema);
