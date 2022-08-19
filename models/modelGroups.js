module.exports = (sequelize, DataTypes) => {

    const Groups = sequelize.define("group", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING
        },
        published: {
            type: DataTypes.BOOLEAN
        }

    },
        {
            timestamps: false
        }
    )

    return Groups

}