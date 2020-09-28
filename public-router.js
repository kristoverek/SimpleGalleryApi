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
    const formatted = [];
    result.forEach(e => {
        formatted.push({
            id: e.dataValues.id,
            name: e.dataValues.name,
            description: e.dataValues.description,
            imageId: e.dataValues.imageId
        });
    });
    res.json(formatted);
});

// get all images from gallery
publicRouter.get("/gallery/:galleryId", async (req, res) => {
    const galleryId = parseInt(req.params.galleryId);
    if(!galleryId) res.status(400).json({error: "No such gallery"});

    // check if gallery exists
    const galleryQuery = await db.getGallery({id: galleryId});
    if(!galleryQuery || galleryQuery.length <= 0) res.status(400).json({error: "No such gallery"});

    const result = await db.getImage({galleryId: galleryId});
    if(!result) res.status(500).json({error: "Failed to list images"});
    const formatted = [];
    result.forEach(e => {
        formatted.push({
            id: e.dataValues.id,
            name: e.dataValues.name,
            description: e.dataValues.description,
            galleryId: e.dataValues.galleryId
        });
    });
    res.json(formatted);
});

module.exports = publicRouter;