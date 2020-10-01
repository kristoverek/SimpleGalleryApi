const fs = require("fs").promises;
const {existsSync} = require("fs");
const gm = require("gm");
const {v4: uuidv4} = require('uuid');

// get size of an image
const getSize = async img => {
    return new Promise((resolve, reject) => {
        img.size((error, result) => {
            if(!error) {
                resolve(result);
            } else {
                reject(false);
            }
        });
    });
};

// get format of an image
const getFormat = async img => {
    return new Promise((resolve, reject) => {
        img.format((error, result) => {
            if(!error) {
                resolve(result);
            } else {
                reject(false);
            }
        });
    });
};

const getBuffer = async (img, format) => {
    return new Promise((resolve, reject) => {
        img.toBuffer(format, (error, result) => {
            if(!error) {
                resolve(result);
            } else {
                reject(false);
            }
        });
    });
};

exports.saveTemporaryImage = async file => {
    const uuid = uuidv4();
    const image = gm(file);

    try {
        await getFormat(image);
    } catch(error) {
        return false;
    }

    try {
        await fs.writeFile(`./tmp/${uuid}`, file);
    } catch(error) {
        return false;
    }
    return uuid;
};

exports.savePermanentImage = async uuid => {
    if(!existsSync(`./tmp/${uuid}`)) return false;
    const image = gm(`./tmp/${uuid}`);

    const thumbBuffer = await getBuffer(image.resize(512, 512), "PNG");
    if(!thumbBuffer) return false;

    try {
        await fs.rename(`./tmp/${uuid}`, `./data/${uuid}`);
        await fs.writeFile(`./data/${uuid}-thumb`, thumbBuffer);
    } catch(error) {
        return false;
    }
    return true;
};

exports.deletePermanentImage = async uuid => {
    try {
        await fs.unlink(`./data/${uuid}`);
        await fs.unlink(`./data/${uuid}-thumb`);
    } catch(error) {
        return false;
    }
    return true;
};

exports.getPermanentImage = async (uuid, size) => {
    const image = gm(`./data/${uuid}`);

    try {
        const imageFormat = await getFormat(image);
        if(!imageFormat) return false;

        const imageSize = await getSize(image);
        if(!imageSize) return false;
        
        const imageBuffer = await getBuffer(imageSize.width > size || imageSize.height > size ? image.resize(size, size) : image, imageFormat);
        if(!imageBuffer) return false;

        return {format: imageFormat, buffer: imageBuffer};
    } catch(error) {
        return false
    }
};