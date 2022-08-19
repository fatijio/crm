module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        login: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fio: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        published: {
            type: DataTypes.BOOLEAN
        }

    })

    return User

}