module.exports = (sequelize, DataTypes) => {

    const Notify = sequelize.define("notification", {
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        types: {
            type: DataTypes.STRING
        },
        removed: {
            type: DataTypes.BOOLEAN
        },
        published: {
            type: DataTypes.BOOLEAN
        }

    })

    return Notify

}