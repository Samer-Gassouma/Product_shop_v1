import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  const { page, searchQuery } = req.query;
  const pageSize = 12; // Number of products per page

  try {
    await mongooseConnect();

    // Create a regex pattern for case-insensitive search
    const regex = new RegExp(searchQuery, "i");

    const query = searchQuery ? { $or: [{ title: regex }, { description: regex }] } : {};

    const products = await Product.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the products." });
  }
}
