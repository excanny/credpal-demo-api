import { Schema, model } from "mongoose";

const postSchema = new Schema({
  title: String,
  content: String,
  user: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export const Post = model("Post", postSchema);