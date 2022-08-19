module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define("message", {
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        removed: {
            type: DataTypes.BOOLEAN
        },
        published: {
            type: DataTypes.BOOLEAN
        }

    })

    return Message

}