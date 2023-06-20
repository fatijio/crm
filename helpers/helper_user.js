const db = require('../models');
const User = db.users;
const Task = db.tasks;
//const jwt = require('jsonwebtoken');
//const { secret_key, access_token_key, refresh_token_key } = require('../config/config');

const getOneUserInfo = async (userid) => {
    try {
        let user = await User.findOne({ where: { id: userid } })
        //console.log(user.dataValues)
        delete user.dataValues.password;
        return user.dataValues;
    } catch (error) {
        console.log('getOneUserInfo', error);
    }
}

const getOwnerTask = async (idTask) => {
    try {
        const owner = await Task.findOne({
            attributes: ['userId'],
            where: {
                id: idTask
            }
        });
        const ownerId = owner.userId;
        return ownerId;
    } catch (error) {
        console.log('getOwnerTask', error);
    }
}

module.exports = {
    getOneUserInfo,
    getOwnerTask
}