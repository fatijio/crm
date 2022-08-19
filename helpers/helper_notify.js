const db = require('../models')
//const { validateAccessToken } = require('../helpers/helper_token');
const NotifyModel = db.notify;

const sendMessageNotify = async (taskId, descriptionData, toUser, fromUser) => {
    await NotifyModel.create({
        message: `Задача № ${taskId} добавлен комментарий`,
        description: descriptionData.length > 30 ? descriptionData.substring(0, 30) + '...' : descriptionData,
        published: 1,
        user_id: toUser,
        from_user_id: fromUser
    });
}

const sendStatusNotify = async () => {

}

module.exports = {
    sendMessageNotify,
    sendStatusNotify
}

