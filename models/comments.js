
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: String},
  comment: { type: String},
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
});

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);

