import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { callOpenRouter } from "../utils/openRouter.js";
import { requireCompletedProfile } from "../utils/profile.js";

const systemPrompts = {
  balanced:
    "You are a professional fitness coach AI. Give practical, safe, and actionable advice. Keep responses concise.",
  intense:
    "You are a professional fitness coach AI with a high-energy tone. Give practical, safe, and actionable advice. Keep responses concise and motivating.",
  calm: "You are a professional fitness coach AI with a calm, reassuring tone. Give practical, safe, and actionable advice. Keep responses concise.",
};

const buildFallbackReply = (tone) => {
  if (tone === "intense") {
    return "Focus on one clear win today: 20-30 minutes, controlled effort, and finish stronger than you started. Keep form sharp and stop if pain changes your movement.";
  }

  if (tone === "calm") {
    return "Choose a manageable session today, keep the intensity moderate, and pay attention to form and recovery. If anything feels sharp or unstable, scale back.";
  }

  return "Pick a realistic session you can complete today, prioritize form, and progress one variable at a time. If pain appears, reduce intensity and reassess.";
};

export const getChatHistory = async (req, res) => {
  await requireCompletedProfile(req.user.uid);

  const chat = await Chat.findOne({ userId: req.user.uid });
  res.json({ messages: chat?.messages || [] });
};

export const createChatReply = async (req, res) => {
  const user = await requireCompletedProfile(req.user.uid);
  const { message, coachTone } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ message: "Message is required" });
  }

  const tone = coachTone || user.coachTone || "balanced";
  const systemPrompt = systemPrompts[tone] || systemPrompts.balanced;
  const chat = (await Chat.findOne({ userId: req.user.uid })) || new Chat({ userId: req.user.uid, messages: [] });
  const recentMessages = chat.messages.slice(-12).map(({ role, content }) => ({ role, content }));

  let reply = "";

  try {
    reply = await callOpenRouter({
      messages: [
        { role: "system", content: systemPrompt },
        ...recentMessages,
        { role: "user", content: message },
      ],
      temperature: 0.7,
      maxTokens: 220,
    });
  } catch (error) {
    console.warn("Falling back to local chat reply", error.message);
    reply = buildFallbackReply(tone);
  }

  chat.messages.push(
    { role: "user", content: message, createdAt: new Date() },
    { role: "assistant", content: reply, createdAt: new Date() },
  );
  chat.messages = chat.messages.slice(-30);
  await chat.save();

  if (coachTone && coachTone !== user.coachTone) {
    user.coachTone = coachTone;
    await user.save();
  }

  return res.status(201).json({
    reply,
    messages: chat.messages,
  });
};
