const cloudinary = require("cloudinary");
const process = require("process");
const env = process.env

cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUD_APIKEY,
    api_secret: env.CLODU_SECRET
});


module.exports = cloudinary;