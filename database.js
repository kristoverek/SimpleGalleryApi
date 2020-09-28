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
        type: DataTypes.STRING
    }
}, {});

const Image = sequelize.define('image', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    }
}, {});

Image.belongsTo(Gallery, {onDelete: "CASCADE"});
// Gallery.belongsTo(Image, {onDelete: "CASCADE"});

Gallery.sync();
Image.sync();

//
// Database operations
//

//Add a new gallery
exports.addGallery = async values => {
    try {
        const result = await Gallery.create(values);
        return result.toJSON();
    } catch(error) {
        return error;
    }
};

exports.modGallery = async () => {

};

exports.getGallery = async id => {
    try {
        if(id) {
            return await Gallery.findAll({
                where: {id: id}
            });
        } else {
            return await Gallery.findAll();
        }
    } catch(error) {
        return error;
    }
};

exports.addImage = async values => {
    try {
        const result = await Image.create(values);
        return result.toJSON();
    } catch(error) {
        return error;
    }
};