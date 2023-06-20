module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        login: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        },
        middleName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        birthDate: {
            type: DataTypes.DATE
        },
        profession: {
            type: DataTypes.STRING
        },
        post: {
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