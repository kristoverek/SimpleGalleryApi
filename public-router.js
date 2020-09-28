const express = require("express");
const db = require("./database.js");

const publicRouter = express.Router();

// send help
publicRouter.get("/", (req, res) => {
    const info = `SimpleGalleryApi endpoints:
GET /public/gallery
GET /public/gallery/:galleryId
GET /public/image/:imageId?size=integer`;
    res.send(info);
});

// get galleries
publicRouter.get("/gallery", async (req, res) => {
    const result = await db.getGallery();
    if(!result) res.status(500).json({error: "Failed to list galleries"});
    res.json(result.map(e => e.toJSON()));
});

module.exports = publicRouter;