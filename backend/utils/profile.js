import User from "../models/User.js";

export const requireCompletedProfile = async (userId) => {
  const user = await User.findOne({ userId });

  if (!user || !user.username || !user.avatar) {
    const error = new Error("Complete your profile before using the app");
    error.statusCode = 403;
    throw error;
  }

  return user;
};
