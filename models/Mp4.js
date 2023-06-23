const mongoose = require("mongoose");

const Mp4Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      max: 50,
    },
    genre: {
      type: String,
    },
    recommendSong: {
      type: Boolean,
      default: false,
    },

    artist: {
      type: String,
      required: true,
    },
    album: { type: String },
    year: { type: String },

    filepath: { type: String },
    videoDownload: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mp4", Mp4Schema);
