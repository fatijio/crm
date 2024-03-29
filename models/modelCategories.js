const { DataTypes } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("category", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT
        },
        published: {
            type: DataTypes.BOOLEAN
        },
    },
        {
            timestamps: false
        })
    return Category
}