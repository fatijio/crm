const db = require('../models')
const { validateAccessToken, validateRefreshToken } = require('../helpers/helper_token');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const NotifyModel = db.notify;

let clients = [];
//const ADMIN = 3;

const notifySubscribers = (toUser, fromUser, isAdmin, message) => {
    // Send a message to each subscriber
    //console.log('clients', clients);
    if (isAdmin) {
        const toClient = clients.find(one => one.id === toUser);
        if (toClient) {
            toClient.res.write(`id: ${toClient.id}\n`);
            toClient.res.write(`data: ${JSON.stringify(message)}\n\n`);
        }
    } else {
        //const toAdmin = clients.find(one => one.id === ADMIN);
        //console.log('toAdmin', toAdmin);
        clients.forEach((client) => {
            if (client.group === 1) {
                console.log('client_uid', client.uid);
                client.res.write(`id: ${client.uid}\n`);
                client.res.write(`data: ${JSON.stringify(message)}\n\n`);
            }
        });
        /*if (toAdmin) {
            toAdmin.res.write(`id: ${toAdmin.id}\n`);
            toAdmin.res.write(`data: ${JSON.stringify(message)}\n\n`);
        }*/
    }
    /*clients.forEach((client, index) => {
        //console.log('client', client);
        if (toUser == client.id && toUser != fromUser) {
            //if(toUser == fromUser)
            client.res.write(`data: ${JSON.stringify(message)}\n\n`);
        }
        if (fromUser > 1 && client.id == 1) {
            client.res.write(`data: ${JSON.stringify(message)}\n\n`);
        }
    });*/
};

const getNewData = (req, res) => {
    const checkToken = req.cookies.refreshToken;
    let userData = validateRefreshToken(checkToken);
    //res.setHeader('Access-Control-Allow-Origin', '*');
    if (userData) {
        res.writeHead(200, {
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
            //"Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Cache-Control": "no-cache",
        });

        //console.log('userData', userData);

        const id = userData.id;
        const uid = Date.now();
        const client = {
            id,
            uid,
            group: userData.group,
            res,
        };

        clients.push(client);

        console.log(`Client connected: ${uid}`);
        //console.log('Его res:', client.res);
        req.on("close", () => {
            console.log(`Client disconnected: ${uid}`);
            clients = clients.filter((client) => client.id !== uid);
        });
    }

}

const getUserNotify = async (req, res) => {
    const userAccessToken = req.headers.authorization;
    const userAccessTokenCheck = validateAccessToken(userAccessToken.split(' ')[1]);
    let query = '';
    //console.log('access_token_data', userAccessTokenCheck);

    if (userAccessTokenCheck.group !== 1) {
        query = {
            attributes: ['id', 'message', 'description'],
            where: {
                user_id: userAccessTokenCheck.id,
                from_user_id: { [Op.ne]: userAccessTokenCheck.id }
            }
        }
    } else {
        query = {
            attributes: ['id', 'message', 'description'],
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
    deleteUserNotify,
    getNewData,
    notifySubscribers
}