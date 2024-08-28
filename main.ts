import dotenv from "dotenv";
import express from "express";

import { LinkedInBot } from "./src/linkedinBot";

dotenv.config();

const app = express();
app.use(express.json());

interface LinkedInMessage {
  urls: string[];
  messages: string[];
}

app.post("/linkedin/send_invites", async (req, res) => {
  const messageData: LinkedInMessage = req.body;

  if (
    !messageData.urls ||
    !messageData.messages ||
    messageData.urls.length !== messageData.messages.length
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const bot = new LinkedInBot();
  const sessionKey = process.env.LINKEDIN_EMAIL;
  const sessionPassword = process.env.LINKEDIN_PASSWORD;

  if (!sessionKey || !sessionPassword) {
    return res.status(500).json({
      error: "LinkedIn credentials not found in environment variables.",
    });
  }

  try {
    console.log("Initializing Bot");
    await bot.initialize();
    console.log("Bot Initialized");
    await bot.run(
      sessionKey,
      sessionPassword,
      messageData.urls,
      messageData.messages
    );
    res.json({ status: "success", message: "Messages sent successfully" });
  } catch (e) {
    res.status(500).json({ error: `An error occurred: ${e}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
