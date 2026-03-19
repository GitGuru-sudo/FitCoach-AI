import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      required: true,
      enum: ["Running", "Yoga", "Cycling", "Gym", "Swimming"],
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
