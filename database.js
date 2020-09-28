const {Sequelize, DataTypes} = require("sequelize");

//
// Database connection setup
//
const sequelize = new Sequelize("sqlite::memory", {
    logging: false
});

//
// Defining models
//
const Gallery = sequelize.define('gallery', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    }
}, {});

const Image = sequelize.define('image', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});

Image.belongsTo(Gallery, {onDelete: "CASCADE"});
Gallery.belongsTo(Image, {onDelete: "CASCADE"});

Gallery.sync();
Image.sync();

//
// Database operations
//

//Add a new gallery
exports.addGallery = async values => {
    try {
        return await Gallery.create(values);
    } catch(error) {
        return false;
    }
};

exports.modGallery = async () => {

};

exports.getGallery = async value => {
    try {
        if(value) {
            return await Gallery.findAll({
                where: value
            });
        } else {
            return await Gallery.findAll();
        }
    } catch(error) {
        return false;
    }
};

exports.addImage = async values => {
    try {
        return await Image.create(values);
    } catch(error) {
        return false;
    }
};

exports.getImage = async value => {
    try {
        if(value) {
            return await Image.findAll({
                where: value
            });
        } else {
            return await Image.findAll();
        }
    } catch(error) {
        return false;
    }
};