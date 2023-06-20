const ImageKit = require("../Utils/imagekit");
const s3 = require("../Utils/s3aws");
const Mp3 = require("../models/Mp3");
const multer = require("multer");
const path = require("path");
// const cloudinary = require("../Utils/cloudinary");
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
    const { title, image, filepath } = req.body;

    // const title = inputString.replace(/ /g, "");
    const modify = title.replace(/\s+/g, "_");

    try {
      const s3params = {
        Bucket: "YOUR_BUCKET_NAME",
        Key: filepath.originalname,
        Body: filepath.buffer,
      };
      const s3result = s3.upload({
        s3params,
      });
      const result = await ImageKit.upload({
        file: image,
        fileName: "musicimage.jpg",
        // width:300,
        // crop:"scale"
      });
      //create new user
      const newPost = new Mp3({
        title: modify,
        genre: req.body.genre,
        rating: req.body.rating,
        filepath: s3result,
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

        genre: post.genre,
        title: post.title,
        category: post.category,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
/////Update or edith music
router.put("/update/:id", async (req, res) => {
  // const { image } = req.body;
  try {
    const mp3 = await Mp3.findById(req.params.id);

    // const result = await ImageKit.upload({
    //   file: image,
    //   fileName: "musicimage.jpg",
    // });
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
    // Delete the temporary file
    // fs.unlinkSync(image);
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
////to get all music
router.get("/daata", async (req, res) => {
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
router.get("/mp3/:title", async (req, res) => {
  try {
    const mp3 = await Mp3.findOne({
      title: req.params.title.replace(/\s+/g, "_"),
    });

    if (!mp3) {
      return res.status(404).json({ error: "Music not found" });
    }

    // If the music is found, return the music data
    res.json(mp3);
  } catch (err) {
    res.status(500).json(err);
  }
});
////
router.get("/", async (req, res) => {
  try {
    const mp3s = await Mp3.find(
      {},
      "_id title image category recommendSong artist"
    ).sort({ createdAt: -1 });

    res.status(200).json(mp3s);
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
router.delete("/deletes/:title", async (req, res) => {
  try {
    const mp3 = await Mp3.findOne({
      title: req.params.title.replace(/\s+/g, "_"),
    });
    if (mp3) {
      await mp3.remove();
      res.status(200).json({ message: "Music File has been deleted" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
////downloadCount
router.put("/downloadCount/:title", async (req, res) => {
  try {
    const mp3 = await Mp3.findOne({
      title: req.params.title.replace(/\s+/g, "_"),
    });
    if (!mp3) {
      return res.status(404).json({ error: "Music not found" });
    }
    // Increment the download count
    mp3.downloadCount++;
    //  mp3.downloadCount += 1;
    await mp3.save();

    // Return a response indicating success
    res
      .status(200)
      .json({ message: "Download count incremented successfully" });
  } catch (err) {
    res.status(500).json({ err: "Unable to update count" });
  }
});
router.put("/update/image/:id", async (req, res) => {
  try {
    // Get the file path of the uploaded image
    const image = req.body;

    // Upload the image to ImageKit
    const imagResult = await ImageKit.upload({
      file: image,
      fileName: "musicimage.jpg",
    });

    // Get the URL of the uploaded image

    // Update the document in MongoDB
    await Mp3.findByIdAndUpdate(req.params.id, {
      imageURL: imagResult.url,
    });

    // Delete the temporary file
    fs.unlinkSync(image);

    res.send("Update successful");
  } catch (error) {
    res.status(500).send("Error updating data");
  }
});

module.exports = router;
