const db = require('../models');
const rToken = db.refreshes;
const jwt = require('jsonwebtoken');
const { secret_key, access_token_key, refresh_token_key } = require('../config/config');

const generateTokens = async (payloadData) => {
    //console.log('generateTokens', payloadData)
    //console.log('generateTokens----------------userGroup', payloadData.userGroup)
    const payload = { id: payloadData.userId, group: payloadData.userGroup }
    const user = await rToken.findOne({ where: { userId: payload.id } });
    //console.log('generateTokens_user', payloadData)
    /*if (user) {
        rToken.destroy({
            where: {
                userId: payload.id
            }
        });
    }*/
    const access_token = jwt.sign(payload, access_token_key, { expiresIn: "1h" });
    const refresh_token = jwt.sign(payload, refresh_token_key, { expiresIn: "2d" });
    try { //17.08.2022 добавил блок try catch для отлова проблем с созданием refresh токена
        rToken.create({
            userId: payload.id,
            refreshToken: refresh_token
        });
    } catch (error) {
        console.log('Не удалось создать рефреш токен');
        return res.status(404).send('Не удалось авотризоваться проблемы с refresh токеном');
    }
    return {
        access_token,
        refresh_token
    }
}

const validateAccessToken = (token) => {
    try {
        const userData = jwt.verify(token, access_token_key);
        //console.log('validate access token', userData);
        return userData;
    } catch (e) {
        //console.log('validateAccessTokenError', e);
        return false;
    }
}

const validateRefreshToken = (token) => {
    try {
        const userData = jwt.verify(token, refresh_token_key);
        //console.log('validateRefreshToken', userData);
        return userData;
    } catch (e) {
        return false;
    }
}

const findRefreshToken = async (token) => {
    try {
        const refreshToken = await rToken.findOne({ where: { refreshToken: token } });
        console.log('findRefreshToken', refreshToken);
        return refreshToken;
    } catch (error) {
        console.log(error);
    }
}

const removeRefreshToken = async (token) => {
    try {
        const refreshToken = await rToken.destroy({ where: { refreshToken: token } });
        if (!refreshToken) {
            return false;
        }
        return refreshToken;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    generateTokens,
    validateAccessToken,
    validateRefreshToken,
    findRefreshToken,
    removeRefreshToken
}