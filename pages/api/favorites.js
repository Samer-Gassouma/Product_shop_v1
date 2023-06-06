import { ObjectId } from "mongodb";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  const { method } = req;
  const { item } = req.query;

  await mongooseConnect();

  try {
    switch (method) {
      case "GET":
        const products = await Product.find({ _id: { $in: item } });
        return res.status(200).json(products);
      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
