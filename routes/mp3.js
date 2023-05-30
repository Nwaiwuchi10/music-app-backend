const Mp3 = require("../models/Mp3");
const multer = require("multer");
const path = require("path");
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
    try {
      //create new user
      const newPost = new Mp3({
        title: req.body.title,
        genre: req.body.genre,
        rating: req.body.rating,
        filepath: req.body.filepath,
        brand: req.body.brand,
        album: req.body.album,
        image: req.body.image,
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

        genre: post.genre,
        title: post.title,
        category: post.category,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
////to get all music
router.get("/", async (req, res) => {
  try {
    const mp3s = await Mp3.find({}).sort({ createdAt: -1 });
    // .populate("user", ["profilePicture", "username", "Verified", "isAdmin"]);

    res.status(200).json(mp3s);
  } catch (err) {
    res.status(500).json(err);
  }
});
/////// to get music by id
router.get("/:id", async (req, res) => {
  try {
    const mp3 = await Mp3.findById(req.params.id);
    // .populate("user", ["profilePicture", "username", "Verified", "isAdmin"]);

    res.status(200).json(mp3);
  } catch (err) {
    res.status(500).json(err);
  }
});
////
router.get("/data", async (req, res) => {
  try {
    const mp3 = await Mp3.find(
      {},
      "_id user title image category recommendSong artist   "
    ).sort({ createdAt: -1 });
    res.status(200).json(mp3);
  } catch (err) {
    res.status(500).json(err);
  }
});
/////
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
router.put("/like/:id", async (req, res) => {
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
    const mp3 = await Mp3.findById(req.params.id);
    if (mp3) {
      await mp3.remove();
      res.status(200).json({ message: "Music File has been deleted" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
