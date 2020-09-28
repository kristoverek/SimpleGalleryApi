const fs = require("fs").promises;
const {v4: uuidv4} = require('uuid');

exports.saveTemporaryImage = async file => {
    const uuid = uuidv4();
    try {
        await fs.writeFile(`./tmp/${uuid}.txt`, file);
    } catch(error) {
        return false;
    }
    return uuid;
};

exports.savePermanentImage = async uuid => {
    try {
        await fs.writeFile(`./data/${uuid}.txt`, "test");
    } catch(error) {
        return false;
    }
    return true;
};

exports.deletePermanentImage = async uuid => {
    try {
        await fs.unlink(`./data/${uuid}.txt`);
    } catch(error) {
        return false;
    }
    return true;
}