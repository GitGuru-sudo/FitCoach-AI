import mongoose from "mongoose";

const dailyMotivationSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 24,
    },
    usernameLower: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    points: {
      type: Number,
      default: 0,
    },
    weeklyGoal: {
      type: Number,
      default: 5,
      min: 1,
      max: 14,
    },
    weeklyProgress: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    coachTone: {
      type: String,
      default: "balanced",
    },
    weeklyGoalAwardedWeek: {
      type: String,
      default: "",
    },
    dailyMotivation: {
      type: dailyMotivationSchema,
      default: () => ({ quote: "", date: "" }),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.usernameLower;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const User = mongoose.model("User", userSchema);

export default User;
