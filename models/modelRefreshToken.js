module.exports = (sequelize, DataTypes) => {

    const RefreshToken = sequelize.define("refresh_token", {
        userId: {
            type: DataTypes.INTEGER
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return RefreshToken

}