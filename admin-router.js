const express = require("express");
const db = require("./database.js");

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
POST /admin/login
POST /admin/upload
POST /admin/gallery/add
POST /admin/gallery/update
POST /admin/gallery/delete
POST /admin/image/add
POST /admin/image/update
POST /admin/image/delete`;
    res.send(info);
});

// add new gallery
// params: name, description, coverUUID
adminRouter.post("/gallery/add", async (req, res) => {
    const {name, description, coverUUID} = req.body;
    try {
        const result = await db.addGallery(name, description, coverUUID);
        res.json({
            id: result.dataValues.id,
            name: result.dataValues.name,
            description: result.dataValues.description
        });
    } catch(error) {
        res.status(400).json({error: error.toString()});
    }
});

module.exports = adminRouter;