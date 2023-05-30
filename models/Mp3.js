const mongoose = require("mongoose");

const Mp3Schema = new mongoose.Schema(
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

    // ratingReview: [
    //   {
    //     type: Number,
    //     required: true,

    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       required: true,
    //       ref: "User",
    //     },
    //   },
    // ],

    // likess: [
    //   {
    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       required: true,
    //       ref: "User",
    //     },
    //   },
    // ],
    artist: {
      type: String,
      required: true,
    },
    album: { type: String },
    year: { type: String },

    filepath: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mp3", Mp3Schema);
