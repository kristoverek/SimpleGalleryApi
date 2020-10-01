const express = require("express");
const multer = require("multer");
const db = require("./database.js");
const imageProcessor = require("./image-processor.js");
const config = require("./defaults/config.json");

// multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: config.maxFileSize
    }
});

const adminRouter = express.Router();

// decode json
adminRouter.use(express.json());

// authentication
adminRouter.use((req, res, next) => {
    if(false) {
        res.status(403).json({error: "Unauthorized"});
    } else {
        next();
    }
});

// add new gallery
// params: name, description, coverUuid
adminRouter.post("/gallery", async (req, res) => {
    if(!req.body.name) res.status(400).json({error: "No name specified"});

    // set values to insert
    const values = {};
    values.name = req.body.name;
    if(req.body.description) values.description = req.body.description;

    
    // try to permanently save temporary image with uuid
    if(req.body.coverUuid) {
        const imageSaved = await imageProcessor.savePermanentImage(req.body.coverUuid);
        if(!imageSaved) res.status(500).json({error: "Failed to save cover image"});

        // trying to add a new image for cover
        const imageValues = {
            name: `${req.body.name} - cover`,
            uuid: req.body.coverUuid
        };
        const imageAdded = await db.addImage(imageValues);
        if(!imageAdded) {
            imageProcessor.deletePermanentImage(req.body.coverUuid);
            res.status(500).json({error: "Failed to save cover image"});
        }

        values.imageId = imageAdded.dataValues.id;
    }

    const result = await db.addGallery(values);
    if(result) {
        res.json({
            id: result.dataValues.id,
            name: result.dataValues.name,
            description: result.dataValues.description,
            imageId: result.dataValues.imageId
        });
    } else {
        // clean up saved image
        if(imageSaved) imageProcessor.deletePermanentImage(req.body.coverUuid);
        res.status(500).json({error: "Failed to add gallery"});
    }
});

// add a new image
// params: name, description, galleryId, imageUuid
adminRouter.post("/image", async (req, res) => {
    if(!req.body.name) res.status(400).json({error: "No name specified"});
    if(!req.body.imageUuid) res.status(400).json({error: "No imageUuid specified"});
    if(!req.body.galleryId) res.status(400).json({error: "No galleryId specified"});

    // check if gallery exists
    const galleryQuery = await db.getGallery({id: req.body.galleryId});
    if(!galleryQuery || galleryQuery.length <= 0) res.status(400).json({error: "No such gallery"});
    
    // set values to insert
    const values = {};
    values.name = req.body.name;
    values.galleryId = req.body.galleryId;
    if(req.body.description) values.description = req.body.description;

    // try to permanently save temporary image with uuid
    const imageSaved = await imageProcessor.savePermanentImage(req.body.imageUuid);
    if(!imageSaved) res.status(500).json({error: "Failed to save image"});
    values.uuid = req.body.imageUuid;

    const result = await db.addImage(values);
    if(result) {
        res.json({
            id: result.dataValues.id,
            name: result.dataValues.name,
            description: result.dataValues.description,
            galleryId: result.dataValues.galleryId
        });
    } else {
        // clean up saved image
        imageProcessor.deletePermanentImage(req.body.imageUuid);
        res.status(500).json({error: "Failed to add image"});
    }
});

adminRouter.post("/upload", upload.single("image"), async (req, res) => {
    const uuid = await imageProcessor.saveTemporaryImage(req.file.buffer);
    if(uuid) {
        res.json({uuid: uuid});
    } else {
        res.status(400).json({error: "Invalid image"});
    }
});

module.exports = adminRouter;