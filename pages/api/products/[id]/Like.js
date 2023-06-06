import { ObjectId } from "mongodb";
import { mongooseConnect } from "@/lib/mongoose";
import Like from "@/models/Like";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const userId  = req.query.userId;

  await mongooseConnect();

  try {
    switch (method) {
      case "POST":

        const likeDoc = new Like({
          user: userId,
          Liked: true,
          productId: new ObjectId(id),
        });

        await likeDoc.save();

        return res.status(200).json({ message: "Like submitted" });

      case "DELETE":
       
      
      const deleteResult = await Like.deleteOne({
        user: userId,
        productId: new ObjectId(id),
      });
      return res.status(200).json({ message: "Like deleted" });

      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  
}
