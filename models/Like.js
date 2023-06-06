import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: { 
    type: String,
    required: true
  },
  Liked: {
    type: Boolean,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  }
});

export default mongoose.models.Like || mongoose.model("Like", likeSchema);
