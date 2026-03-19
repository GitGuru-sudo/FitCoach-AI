import User from "../models/User.js";
import { getAllowedAvatar, isAllowedAvatar } from "../utils/avatarPresets.js";

const sanitizeUsername = (value) => value.trim().replace(/\s+/g, "");

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ userId: req.user.uid });

  if (user && !isAllowedAvatar(user.avatar)) {
    user.avatar = getAllowedAvatar(user.avatar);
    await user.save();
  }

  res.json({
    profileComplete: Boolean(user?.username && user?.avatar),
    user,
  });
};

export const upsertProfile = async (req, res) => {
  const { username, avatar, weeklyGoal, coachTone } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "Username is required" });
  }

  if (!avatar || typeof avatar !== "string") {
    return res.status(400).json({ message: "Avatar is required" });
  }

  if (!isAllowedAvatar(avatar)) {
    return res.status(400).json({ message: "Please choose one of the available avatars." });
  }

  const sanitizedUsername = sanitizeUsername(username);

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(sanitizedUsername)) {
    return res.status(400).json({
      message: "Username must be 3-24 characters and use only letters, numbers, or underscores",
    });
  }

  const usernameLower = sanitizedUsername.toLowerCase();

  const conflictingUser = await User.findOne({
    usernameLower,
    userId: { $ne: req.user.uid },
  });

  if (conflictingUser) {
    return res.status(409).json({ message: "Username is already taken" });
  }

  const user = await User.findOneAndUpdate(
    { userId: req.user.uid },
    {
      userId: req.user.uid,
      username: sanitizedUsername,
      usernameLower,
      avatar: getAllowedAvatar(avatar),
      weeklyGoal: Number(weeklyGoal) || 5,
      coachTone: coachTone || "balanced",
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  res.status(201).json({ user });
};
