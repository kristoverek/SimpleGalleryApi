const express = require("express");
const db = require("./database.js");
const imageProcessor = require("./image-processor.js");

const publicRouter = express.Router();

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
    if(isNaN(galleryId)) res.status(400).json({error: "No such gallery"});

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

// get actual image data
// query: size
publicRouter.get("/image/:id", async (req, res) => {
    const size = parseInt(req.query.size);
    const id = parseInt(req.params.id);
    if(isNaN(size)) res.status(400).json({error: "Incorrect size"});
    if(isNaN(id)) res.status(400).json({error: "Incorrect id"});

    const imageQuery = await db.getImage({id: id});
    if(!imageQuery || imageQuery.length != 1) res.status(400).json({error: "No image with such id"});

    
    if(!size) {
        try {
            res.set("Content-Type", "image/png").sendFile(`./data/${imageQuery[0].dataValues.uuid}-thumb`, {root: __dirname});
        } catch(error) {
            res.status(500).json({error: "Failed to get thumbnail"});
        }
    } else {
        const imageData = await imageProcessor.getPermanentImage(imageQuery[0].dataValues.uuid, size);
        if(!imageData) res.status(500).json({error: "Failed to get image"});

        res.type(imageData.format.toLowerCase()).send(imageData.buffer);
    }
});

module.exports = publicRouter;