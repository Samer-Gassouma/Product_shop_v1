import { mongooseConnect } from "@/lib/mongoose";

export default async function submitFeedback(req, res) {
  if (req.method === "POST") {
    try {
      // Extract the feedback message from the request body
      const { feedback,email } = req.body;

      const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      // Connect to the MongoDB database
      const { db } = await mongooseConnect();

      // Save the feedback in the "feedbacks" collection
      await db.collection("feedbacks").insertOne({ message: feedback ,email });

      await db.collection("log").insertOne({
        ipAddress,
        timestamp: new Date(),
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while submitting the feedback." });
    }
  } else {
    res.status(400).json({ error: "Invalid request method. Only POST requests are allowed." });
  }
}
