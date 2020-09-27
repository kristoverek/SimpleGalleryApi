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
    },
    cover: {
        type: DataTypes.STRING,
        defaultValue: "../defaults/cover.png"
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

Image.belongsTo(Gallery, {foreignKey: {allowNull: false}, onDelete: "CASCADE"});

Gallery.sync();
Image.sync();

//
// Database operations
//

//Add a new gallery
exports.addGallery = async (name, description, cover) => {
    const values = {};
    values.name = name;
    if(description) values.description = description;
    if(cover) values.cover = cover;
    return await Gallery.create(values);
};