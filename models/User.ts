import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  moodEntries: [
    {
      date: Date,
      mood: Number, // 1-10 scale
      notes: String,
    },
  ],
  journalEntries: [
    {
      date: Date,
      content: String,
      tags: [String],
    },
  ],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
