const db = require('../models');
const User = db.users;
const jwt = require('jsonwebtoken');
const { secret_key, access_token_key, refresh_token_key } = require('../config/config');

const getOneUserInfo = async (userid) => {
    try {
        let user = await User.findOne({ attributes: ['login', 'fio', 'group_id'], where: { id: userid } })
        //console.log(user.dataValues)
        return user.dataValues;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getOneUserInfo
}