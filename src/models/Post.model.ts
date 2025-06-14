import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    author: { type: String, required: false }, // ← CHANGED from ObjectId to String
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    image: { type: String, required: false, trim: true, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    likes: { type: Number, default: 0 },

    comments: [CommentSchema],
  },
  { timestamps: true }
);

const PostModel = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default PostModel;
