import { mongooseConnect } from "@/lib/mongoose";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const { db } = await mongooseConnect();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(password !== user.password) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id,email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;


    await db.collection("log").insertOne({
      email,
      ipAddress,
      timestamp: new Date(),
    });

    res.status(200).json({ token , email: user.email});
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
