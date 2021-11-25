const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  // likes: {type: mongoose.Schema.Types.ObjectId, ref:"User"},/////
  // likes: { type: Number, default: 0},
  // likedBy: {type: Array},
  // dislikes: { type: Number, default: 0},
  // dislikedBy: {type: Array},/////
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Post", postSchema);
