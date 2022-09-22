module.exports = (sequelize, DataTypes) => {

    const File = sequelize.define("file", {
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        originalname: {
            type: DataTypes.STRING
        },
        destination: {
            type: DataTypes.STRING
        },
        types: {
            type: DataTypes.STRING
        },
        size: {
            type: DataTypes.FLOAT
        },
        description: {
            type: DataTypes.STRING
        },
        published: {
            type: DataTypes.BOOLEAN
        }

    },
    )

    return File

}