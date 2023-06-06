import { ObjectId } from "mongodb";
import { mongooseConnect } from "@/lib/mongoose";
import Comment from "@/models/comments";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await mongooseConnect();

  switch (method) {
    case "POST":
      try {
        const { user, comment } = req.body;

        if (!user || !comment) {
          return res.status(400).json({ message: "Invalid comment data" });
        }

        const commentDoc = new Comment({
          user,
          comment,
          productId: new ObjectId(id),
        });

        const savedComment = await commentDoc.save();

        return res.status(201).json({ message: "Comment submitted successfully", comment: savedComment });
      } catch (error) {
        console.error("Error submitting the comment:", error);
        return res.status(500).json({ message: "Failed to submit the comment" });
      }
      case "GET":
        try {
            const comments = await Comment.find({ productId: new ObjectId(id) });
            return res.status(200).json({ comments });
        } catch (error) {
            console.error("Error getting comments:", error);
            return res.status(500).json({ message: "Failed to get comments" });
        }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
