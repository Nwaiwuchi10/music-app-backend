const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_KEY,
//   api_secret: process.env.CLOUD_KEY_SECRET,
// });
cloudinary.config({
  cloud_name: "dk1hvevsa",
  api_key: "818734736529549",
  api_secret: "Xor_Uf7bDQUlDQx25P_J-rwFa9I",
});

module.exports = cloudinary;
