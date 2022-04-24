const mongoose = require("mongoose");

const MemorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    url: {
      type: String,
      required: [true, "Please add a memory url"],
    },
    memoryType: {
      type: String,
      required: [true, "Please add a memory type"],
      enum: ["image", "video"],
    },
    privacy: {
      type: String,
      required: [true, "Please add a privacy"],
      enum: ["public", "private"],
      default: "private",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("memory", MemorySchema);
