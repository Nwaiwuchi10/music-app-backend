const mongoose = require("mongoose");

const UploadMusicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      // required:[true,'Music must at least a title']
    },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   //   required: true,
    //   ref: "User",
    // },
    image: {
      type: String,
      // required: true,
    },
    musicImageCover: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    lyrics: {
      type: String,
    },
    category: {
      type: String,
      max: 50,
    },
    genre: {
      type: String,
    },
    downloadCount: {
      type: Number,
      default: 0,
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
    country: {
      type: String,
      // required: true,
    },
    album: { type: String },
    year: { type: String },

    filepath: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UploadMusic", UploadMusicSchema);
