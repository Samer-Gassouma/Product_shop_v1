import User from "@/models/User";

import { mongooseConnect } from "@/lib/mongoose";


export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await mongooseConnect();

      const { email, password } = req.body;


      // Create a new user instance
      const newUser = new User({
        email,
        password,
      });

      // Save the user to the database
      const savedUser = await newUser.save();

      res.status(200).json({ message: "User stored in the database", user: savedUser });
    } catch (error) {
      console.error("Error storing user in the database:", error);
      res.status(500).json({ message: "Error storing user in the database" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
