const Mp3 = require("../models/Mp3");
const multer = require("multer");

const Mp4 = require("../models/Mp4");
const imagekitvideo = require("../Utils/imagekitvideo");
const imagekit = require("../Utils/imagekit");
const router = require("express").Router();

/////multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}-${Date.now()}`);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("mp3"), async (req, res) => {
  const {
    title,
    // filepath,
    artist,
    description,
    image,
    category,
    album,
    year,
    genre,
  } = req.body;
  const filepath = req.file;
  const mp3 = new Mp3({
    title,
    artist,
    album,
    year,
    image,
    category,
    description,
    genre,
    filepath,
  });
  try {
    await mp3.save();
    res.send("File uploaded");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

///create new post
router.post(
  "/",

  async (req, res) => {
    const { title, image, videoDownload, filepath } = req.body;

    // const title = inputString.replace(/ /g, "");
    const modify = title.replace(/\s+/g, "_");
    try {
      const result = await imagekit.upload({
        file: image,
        fileName: `${req.body.artist}-${req.body.title}.jpg`,

        // width:300,
        // crop:"scale"
      });
      const results = await imagekitvideo.upload({
        file: videoDownload,
        fileName: `${req.body.artist}-${req.body.title}.MP4`,
        folder: "/videos",
        // width:300,
        // crop:"scale"
      });
      const youtuberesults = await imagekitvideo.upload({
        file: filepath,
        fileName: `${req.body.filepath}`,
        folder: "/youtube",
        // width:300,
        // crop:"scale"
      });
      const newPost = new Mp4({
        title: modify,
        genre: req.body.genre,
        rating: req.body.rating,
        filepath: youtuberesults.url,
        videoDownload: results.url,
        brand: req.body.brand,
        album: req.body.album,
        image: result.url,
        year: req.body.year,
        recommendSong: req.body.recommendSong,
        artist: req.body.artist,
        likes: req.body.likes,
        description: req.body.description,
        category: req.body.category,
      });

      //save post and respond
      const post = await newPost.save();

      res.status(200).json({
        id: post.id,
        artist: post.artist,
        recommendSong: post.recommendSong,
        filepath: post.filepath,
        image: post.image,
        rating: post.rating,
        year: post.year,
        likes: post.likes,
        brand: post.brand,
        album: post.album,
        description: post.description,
        videoDownload: post.videoDownload,
        genre: post.genre,
        title: post.title,
        category: post.category,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
/////update or edith
router.put("/update/:id", async (req, res) => {
  try {
    const mp3 = await Mp4.findById(req.params.id);
    mp3.image = req.body.image || mp3.image;
    mp3.artist = req.body.artist || mp3.artist;
    mp3.filepath = req.body.filepath || mp3.filepath;
    mp3.title = req.body.title || mp3.title;
    mp3.description = req.body.description || mp3.description;
    mp3.brand = req.body.brand || mp3.brand;
    mp3.recommendSong = req.body.recommendSong || mp3.recommendSong;
    mp3.year = req.body.year || mp3.year;
    mp3.category = req.body.category || mp3.category;
    mp3.album = req.body.album || mp3.album;
    mp3.genre = req.body.genre || mp3.genre;

    const updatedUser = await mp3.save();
    res.status(200).json({
      _id: updatedUser._id,
      brand: updatedUser.brand,
      image: updatedUser.image,
      artist: updatedUser.artist,
      title: updatedUser.title,
      recommendSong: updatedUser.recommendSong,
      filepath: updatedUser.filepath,
      description: updatedUser.description,
      year: updatedUser.year,
      category: updatedUser.category,
      album: updatedUser.album,
      genre: updatedUser.genre,
    });
  } catch (err) {
    res.status(500).json({ err: "Failed to update" });
  }
});
//// update youtube
router.put("/updateyoutube/:id", async (req, res) => {
  try {
    const { filepath } = req.body;
    const mp4 = req.params.id;

    // Upload YouTube video to ImageKit
    const uploadResponse = await imagekit.upload({
      file: filepath,
      fileName: `video_${mp4}.mp4`,
      folder: "/youtube",
    });

    // Update MongoDB record with ImageKit URL
    const updatedVideo = await Mp4.findByIdAndUpdate(
      mp4,
      {
        filepath: uploadResponse.url,
      },
      { new: true }
    );

    res.json(updatedVideo);
  } catch (err) {
    console.error("Error updating video:", err);
    res.status(500).json({ error: "Failed to update video" });
  }
});
////to get all music
router.get("/", async (req, res) => {
  try {
    const mp4s = await Mp4.find({}).sort({ createdAt: -1 });
    // .populate("user", ["profilePicture", "username", "Verified", "isAdmin"]);

    res.status(200).json(mp4s);
  } catch (err) {
    res.status(500).json(err);
  }
});
//
router.get("/data", async (req, res) => {
  try {
    const mp4s = await Mp4.find(
      {},
      "_id title image category recommendSong artist   "
    ).sort({ createdAt: -1 });

    res.status(200).json(mp4s);
  } catch (err) {
    res.status(500).json(err);
  }
});
/////// to get music by id
router.get("/:id", async (req, res) => {
  try {
    const mp4 = await Mp4.findById(req.params.id);
    // .populate("user", ["profilePicture", "username", "Verified", "isAdmin"]);

    res.status(200).json(mp4);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/mp4/:title", async (req, res) => {
  try {
    const mp4 = await Mp4.findOne({
      title: req.params.title.replace(/\s+/g, "_"),
    });

    if (!mp4) {
      return res.status(404).json({ error: "Music Video not found" });
    }

    // If the music is found, return the music data
    res.json(mp4);
  } catch (err) {
    res.status(500).json(err);
  }
});
////
router.get("/get/:id", async (req, res) => {
  const id = req.params.id;

  // Retrieve the mp3 file data from the database
  const mp3 = await Mp3.findById(id);
  if (!mp3) {
    return res.status(404).send("File not found");
  }

  // Set the headers to indicate that the browser should download the file
  // res.set({
  //   "Content-Disposition": 'attachment; filename="' + mp3.filename + '"',
  //   "Content-Type": "audio/mpeg",
  // });

  // Send the file data as the response body

  res.download(mp3.filepath);
  // res.send(mp3.data);
});
router.get("/download/:id", async (req, res) => {
  const id = req.params.id;

  // Retrieve the mp3 file data from the database
  const mp3 = await Mp3.findById(id);
  if (!mp3) {
    return res.status(404).send("File not found");
  }

  // Set the headers to indicate that the browser should download the file
  res.set({
    "Content-Disposition": 'attachment; filename="' + mp3.filename + '"',
    "Content-Type": "audio/mpeg",
  });

  // Send the file data as the response body

  res.send(mp3.data);
});
///
router.put("/likes/:id", async (req, res) => {
  try {
    const mp3 = await Mp3.findById(req.params.id);
    if (!mp3.likes.includes(req.body.user)) {
      await mp3.updateOne({ $push: { likes: req.body.user } });
      res.status(200).json("The post has been liked");
      const savedlikes = await newLikes.save();
      res.status(200).json(savedlikes);
    } else {
      await mp3.updateOne({ $pull: { likes: req.body.user } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const mp4 = await Mp4.findById(req.params.id);
    if (mp4) {
      await mp4.remove();
      res.status(200).json({ message: "Music File has been deleted" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
router.put("/update/image/:id", async (req, res) => {
  try {
    // Get the file path of the uploaded image
    const image = req.body;

    // Upload the image to ImageKit
    const imageUploadResponse = await ImageKit.upload({
      file: image,
    });

    // Get the URL of the uploaded image
    const imageURL = imageUploadResponse.url;

    // Update the document in MongoDB
    const updatedDoc = await Mp4.findByIdAndUpdate(req.params.id, {
      imageURL: imageURL,
    });

    // Delete the temporary file
    fs.unlinkSync(image);

    // res.send('Update successful');
    res.status(600).json({
      _id: updatedUser._id,

      image: updatedDoc.image,
    });
  } catch (error) {
    res.status(500).send("Error updating data");
  }
});
module.exports = router;
