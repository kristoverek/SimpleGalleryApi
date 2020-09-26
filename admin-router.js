const express = require("express");

const adminRouter = express.Router();

//authentication
adminRouter.use((req, res, next) => {
    if(true) {
        res.status(403).send("Unauthorized");
    } else {
        next();
    }
});

//send help
adminRouter.get("/", (req, res) => {
    const info = `SimpleGalleryApi endpoints:
POST /admin/login
POST /admin/upload
POST /admin/galleries/add
POST /admin/galleries/update
POST /admin/galleries/delete
POST /admin/images/add
POST /admin/images/update
POST /admin/images/delete`;
    res.send(info);
});

module.exports = adminRouter;