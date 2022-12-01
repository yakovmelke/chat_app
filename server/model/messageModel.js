const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: Object,
      required: true,
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", messageSchema);
