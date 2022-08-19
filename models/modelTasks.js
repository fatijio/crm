const { DataTypes } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define("tasks", {
        files: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        published: {
            type: DataTypes.BOOLEAN
        },
        createdAt: {
            type: DataTypes.DATE,
        }
    })
    return Task
}