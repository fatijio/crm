const db = require('../models')
//const { validateAccessToken } = require('../helpers/helper_token');
const NotifyModel = db.notify;
const { notifySubscribers } = require('../controllers/controllerNotification');

const sendMessageNotify = async (taskId, descriptionData, toUser, fromUser, isAdmin) => {
    const createdNotice = await NotifyModel.create({
        message: `Задача № ${taskId} добавлен комментарий`,
        description: descriptionData.length > 30 ? descriptionData.substring(0, 30) + '...' : descriptionData,
        published: 1,
        user_id: toUser,
        from_user_id: fromUser
    });

    //console.log('createdNotice', createdNotice.id);

    notifySubscribers(toUser, fromUser, isAdmin, {
        id: createdNotice.id,
        message: `Задача № ${taskId} добавлен комментарий`,
        description: descriptionData.length > 30 ? descriptionData.substring(0, 30) + '...' : descriptionData
    });

}

const sendStatusNotify = async () => {

}

module.exports = {
    sendMessageNotify,
    sendStatusNotify
}

