const { DataTypes } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define("status", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT
        },
        color: {
            type: DataTypes.STRING
        },
        active: {
            type: DataTypes.BOOLEAN
        },
    },
        {
            timestamps: false
        })
    return Status
}