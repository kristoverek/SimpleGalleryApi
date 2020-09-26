const express = require("express");

const publicRouter = express.Router();

// send help
publicRouter.get("/", (req, res) => {
    const info = `SimpleGalleryApi endpoints:
GET /public/galleries
GET /public/gallery/:galleryId
GET /public/images/:imageId?size=integer`;
    res.send(info);
});

module.exports = publicRouter;