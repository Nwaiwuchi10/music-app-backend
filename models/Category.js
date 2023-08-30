const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const CategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,

      max: 20,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
