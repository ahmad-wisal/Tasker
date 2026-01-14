// import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   price: { type: Number, required: true },
//   urgency: { type: String, enum: ["low", "medium", "high"], default: "medium" },
//   location: String,
//   customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   taskerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" },
// }, { timestamps: true });

// const Task = mongoose.model("Task", taskSchema);
// export default Task;  // ✅ Must be default export
 

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
    },

    urgency: {
      type: String,
      enum: ["normal", "urgent"],
      default: "normal",
    },

    status: {
      type: String,
      enum: ["open", "assigned", "completed", "cancelled"],
      default: "open",
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tasker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    scheduledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
