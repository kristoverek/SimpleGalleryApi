const express = require("express");
const https = require("https");
const fs = require("fs");
const config = require("./defaults/config.json");

const publicRouter = require("./public-router.js");
const adminRouter = require("./admin-router.js");

//
// app/routing setup
//
const app = express();

app.use("/public", publicRouter);
app.use("/admin", adminRouter);

//
// ssl setup
//
const sslKey = fs.readFileSync(config.sslKey, "utf-8");
const sslCert = fs.readFileSync(config.sslCert, "utf-8");
const credentials = {key: sslKey, cert: sslCert};

//
// start server
//
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});