import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    default: "New Chat",
  },
  currentStep: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["active", "completed", "archived"],
    default: "active",
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  summary: {
    type: String,
    default: "",
  },
  tags: [
    {
      type: String,
    },
  ],
});

// Update the updatedAt timestamp before saving
ChatSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
