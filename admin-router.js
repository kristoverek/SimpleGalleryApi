const express = require("express");
const db = require("./database.js");
const imageProcessor = require("./image-processor.js");

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

// send help
adminRouter.get("/", (req, res) => {
    const info = `SimpleGalleryApi endpoints:
POST   /admin/login
POST   /admin/upload
POST   /admin/gallery
PUT    /admin/gallery/:galleryId
DELETE /admin/gallery/:galleryid
POST   /admin/image
PUT    /admin/image/:imageId
DELETE /admin/image/:imageId`;
    res.send(info);
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
            description: result.dataValues.description
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

module.exports = adminRouter;