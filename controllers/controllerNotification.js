const db = require('../models')
const { validateAccessToken } = require('../helpers/helper_token');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const NotifyModel = db.notify;


const getUserNotify = async (req, res) => {
    const userAccessToken = req.headers.authorization;
    const userAccessTokenCheck = validateAccessToken(userAccessToken.split(' ')[1]);
    let query = '';
    //console.log('access_token_data', userAccessTokenCheck);

    if (userAccessTokenCheck.group !== 1) {
        query = {
            attributes: ['id', 'message'],
            where: {
                user_id: userAccessTokenCheck.id,
                from_user_id: { [Op.ne]: userAccessTokenCheck.id }
            }
        }
    } else {
        query = {
            attributes: ['id', 'message'],
            where: {
                //user_id: userAccessTokenCheck.id,
                from_user_id: { [Op.ne]: userAccessTokenCheck.id }
            }
        }
    }

    try {
        const data = await NotifyModel.findAll(query)
        //console.log('notify_data', data);
        if (!data) {
            return res.status(400).send({ type: 'error', message: 'Notify problem' });
        }

        return res.status(200).json(data)

    } catch (error) {
        console.log(error);
    }


}

const deleteUserNotify = async (req, res) => {
    const userAccessToken = req.headers.authorization;
    const userAccessTokenCheck = validateAccessToken(userAccessToken.split(' ')[1]);
    const id = req.params.id;
    let query = '';
    //console.log('id_controller_notify', id);
    if (!userAccessTokenCheck) {
        return res.status(400).send({ type: 'error', message: 'Нет доступа для удаления уведомления' });
    }
    if (userAccessTokenCheck.group == 1) {
        query = { where: { id: id } }
    } else {
        query = { where: { id: id, user_id: userAccessTokenCheck.id } }
    }
    const deletedNotice = await NotifyModel.destroy(query);
    if (!deletedNotice) {
        return res.status(400).send({ type: 'error', message: 'Не удалось удалить уведомление' });
    }
    //console.log('deletedNotice', deletedNotice);
    return res.status(200).json(id);

}


module.exports = {
    getUserNotify,
    deleteUserNotify
}