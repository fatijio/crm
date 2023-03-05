const db = require('../models')
const { validateAccessToken } = require('../helpers/helper_token');
const { sendMessageNotify } = require('../helpers/helper_notify');
const { validationResult } = require('express-validator');
const { getOwnerTask } = require('../helpers/helper_user');

// image Upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// create main Model
const Task = db.tasks;
const Status = db.status;
const Category = db.category;
const Message = db.message;
const User = db.users;
const File = db.files;
//const Review = db.comments

// 1. create task
const addTask = async (req, res) => {
    //console.log(req.body)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const result = errors.array().map(item => {
            //console.log(item.msg);
            return item.msg;
        }
        );
        return res.status(400).send(result);
    }

    const userAccessToken = req.headers.authorization;
    const userAccessTokenCheck = validateAccessToken(userAccessToken.split(' ')[1])
    //console.log('acc', userAccessTokenCheck);
    //console.log('path', req.files)
    const collectionFiles = req.files;
    console.log('collection files', collectionFiles);
    //return;

    let taskBody = {
        //files: collection.toString(),
        title: req.body.title,
        status_id: 1,
        category_id: Number(req.body.category_id),
        description: req.body.description,
        published: true,
        userId: userAccessTokenCheck.id,
    }
    try {
        const task = await Task.create(taskBody);
        const savedTask = await Task.findAll({
            attributes: ['id', 'title', 'description', 'createdAt', ['id', 'key']],
            where: { /*userId: userAccessTokenCheck.id*/ id: task.id },
            include: [{ model: Status, attributes: ['id', 'name', 'color'] }, { model: Category, attributes: ['id', 'name'] }]

        });
        if (task) {
            collectionFiles.map(file => {
                file.user_id = userAccessTokenCheck.id,
                    file.task_id = task.id,
                    file.published = 1,
                    file.types = file.mimetype
            })
            const taskFiles = await File.bulkCreate(collectionFiles);
            console.log('taskFilesCreated', taskFiles);
        }
        //console.log('contoller/addTask', task.id);
        //console.log('contoller/addTask', savedTask[0].dataValues);
        return res.status(200).json({ task: savedTask[0].dataValues, msg: 'Задача создана' });
        //return res.status(400).json({ error: { message: 'Не удалось создать задачу', errorName: error.name } });
        //console.log(product)
    } catch (error) {
        return res.status(503).json({ error: { message: 'Не удалось создать задачу', errorName: error.name } });
    }
}

// 2. get all tasks
const getAllTasks = async (req, res) => {
    const userAccessToken = req.headers.authorization;
    const userAccessTokenCheck = validateAccessToken(userAccessToken.split(' ')[1]);
    //console.log('getAllTasks', req);
    if (req.query.statuses === 'get') {
        if (userAccessTokenCheck.group === 1) {
            const query = {
                attributes: ['id', 'name'],
                where: { active: 1 }
            }
            const statusesList = await Status.findAll(query);
            return res.status(200).json(statusesList)
        }
    }
    try {
        let query = '';
        if (userAccessTokenCheck.group === 1) {
            query = {
                attributes: ['id', 'title', 'description', 'createdAt', ['id', 'key']],
                include: [{ model: Status, attributes: ['id', 'name', 'color'] }, { model: Category, attributes: ['id', 'name'] }],
                order: [
                    ['id', 'ASC']
                ]
            }
        } else {
            query = {
                attributes: ['id', 'title', 'description', 'createdAt', ['id', 'key']],
                where: { userId: userAccessTokenCheck.id },
                include: [{ model: Status, attributes: ['id', 'name', 'color'] }, { model: Category, attributes: ['id', 'name'] }],
                order: [
                    ['id', 'ASC']
                ]
            }
        }

        let tasks = await Task.findAll(query);

        //console.log('tasks', tasks);
        if (tasks.length == 0) {
            return res.json({ empty: 'Нет данных' });
        }
        return res.status(200).json(tasks)
    } catch (error) {
        return res.status(401).json('У Вас нет доступа к задачам');
    }

}

// 3. get details task
const getTaskDetail = async (req, res) => {
    try {
        const userAccessToken = req.headers.authorization;
        const userAccessTokenCheck = validateAccessToken(userAccessToken.split(' ')[1]);
        const userId = userAccessTokenCheck.id;
        const taskId = req.params.id
        let query = '';

        if (/*userAccessTokenCheck.id === 1 &&*/ userAccessTokenCheck.group === 1) {
            query = {
                attributes: ['id', 'title', 'description', 'createdAt', ['id', 'key']],
                where: { id: taskId },
                include: [
                    { model: Status, attributes: ['id', 'name', 'color'] },
                    { model: Category, attributes: ['id', 'name'] },
                    { model: File, attributes: ['filename', 'originalname'] },
                    //{ model: Message, where: { published: 1 }, attributes: ['id', 'message', 'createdAt'], include: [{ model: User, attributes: ['fio'] }] },
                ]

            }

            //console.log('query', query);
        } else {
            query = {
                attributes: ['id', 'title', 'description', 'createdAt', ['id', 'key']],
                where: { userId: userId, id: taskId },
                include: [
                    { model: Status, attributes: ['id', 'name', 'color'] },
                    { model: Category, attributes: ['id', 'name'] },
                    { model: File, attributes: ['filename', 'originalname'] }
                    //{ model: Message, where: { published: 1 }, attributes: ['id', 'message', 'createdAt'], include: [{ model: User, attributes: ['fio'] }] },
                ]

            }
        }

        const taskDetail = await Task.findOne(query);

        //console.log('taskDetail', taskDetail);

        if (taskDetail.length == 0) {
            return res.json({ empty: 'Нет данных' });
        }

        // Messages for task
        const taskMessages = await Message.findAll({
            attributes: ['id', 'message', 'createdAt'],
            where: { task_id: taskId, published: 1 },
            include: [{ model: User, attributes: ['fio', 'group_id'] }],
            order: [
                // We start the order array with the model we want to sort
                ['id', 'ASC']
            ]
        });

        //console.log('taskMessages', taskMessages);

        return res.status(200).json({ taskDetail: taskDetail, taskMessages: taskMessages ? taskMessages : 0 })
    } catch (error) {
        return res.status(401).json('У Вас нет доступа к задаче');
    }
}

const getTaskDetailMessages = async (req, res) => {
    console.log('request', req.params);
}

const getCategories = async (req, res) => {
    const categories = await Category.findAll({ attributes: ['id', 'name'] });
    //console.log('categories', categories);
    return res.send(categories);
}

// 4. update task
const updateTask = async (req, res) => {
    let id = req.params.id;
    //console.log('updateTask', req.body);
    //console.log('updateTask_params', req.params);
    const task = await Task.update(req.body, { where: { id: id } });
    res.status(200).send(task);
}
// 5. delete task by id
const deleteTask = async (req, res) => {
    let id = req.params.id
    await Task.destroy({ where: { id: id } })
    res.status(200).send('Задача удалена !')
}

// add messages to task
const addMessageToTask = async (req, res) => {
    const errors = validationResult(req);
    //console.log('errors', errors);
    if (!errors.isEmpty()) {
        const result = errors.array().map(item => {
            //console.log(item.msg);
            return item.msg;
        }
        );
        return res.status(400).json(result);
    }

    //console.log('message body', req.body);
    const userAccessToken = req.headers.authorization;
    const userAccessTokenCheck = validateAccessToken(userAccessToken.split(' ')[1])

    const message = req.body.message;
    const taskId = req.body.taskId;
    let checkUserId = '';
    let isAdmin = false;

    if (/*userAccessTokenCheck.id !== 1 &&*/ userAccessTokenCheck.group !== 1) {
        const checkAccessTask = await Task.findOne({
            attributes: ['id'],
            where: {
                id: taskId,
                userId: userAccessTokenCheck.id
            }
        });
        if (!checkAccessTask) {
            console.log('Нет доступа у вас');
            //res.status(400);
            return res.status(400).send({ error: true, msg: 'Ошибка при отправки сообщения' });
        }
    }



    const messageBody = {
        message: message,
        user_id: userAccessTokenCheck.id,
        task_id: taskId,
        published: 1,
        removed: 0
    }

    const createMessage = await Message.create(messageBody);

    if (userAccessTokenCheck.group == 1) {

        isAdmin = true;

        checkUserId = await Task.findOne({
            attributes: ['userId'],
            //include: []
            where: {
                id: taskId,
            }
        });
        //console.log('checkUserId', checkUserId.userId);
    }
    //console.log('message', message);
    sendMessageNotify(taskId, message, checkUserId ? checkUserId.userId : userAccessTokenCheck.id, userAccessTokenCheck.id, isAdmin);
    //await NotifyModel.create({ message: `Задача № ${taskId} добавлен комментарий`, published: 1, user_id: checkUserId ? checkUserId.userId : userAccessTokenCheck.id, from_user_id: userAccessTokenCheck.id });

    //console.log('createMessage', createMessage);

    // Save sended message with chat
    const savedMessage = await Message.findOne({
        attributes: ['id', 'message', 'user_id', 'task_id', 'createdAt', ['id', 'key']],
        where: {
            /*userId: userAccessTokenCheck.id*/
            id: createMessage.dataValues.id,
            task_id: createMessage.dataValues.task_id,
            published: 1
        },
        include: [{ model: User, attributes: ['fio', 'group_id'] }]

    });

    return res.status(200).send(savedMessage);
}

// get files of task
const getTaskFiles = async (req, res) => {
    //console.log('params', req.params.filename);
    //console.log('params2', req.params);
    const idTask = req.params.id;
    const userAccessToken = req.headers.authorization;
    const userAccessTokenCheck = validateAccessToken(userAccessToken.split(' ')[1]);
    //console.log('userAccessTokenCheck', userAccessTokenCheck);
    let userFolder = userAccessTokenCheck.id;
    //console.log('req', req);
    if (userAccessTokenCheck.group === 1) {
        userFolder = await getOwnerTask(idTask);
        //console.log('userFolder', userFolder);
    }
    const fileName = req.params.filename;
    const dir = __basedir + `/upload/${userFolder}/`;
    //console.log('dir', dir);
    var options = {
        root: dir,
        dotfiles: 'deny',
        headers: {
            //'x-timestamp': Date.now(),
            //'x-sent': true
        }
    }
    fs.readdir(dir, function (err, list) {
        if (err) throw err;
        for (let i = 0; i < list.length; i++) {
            //console.log('i------', list[i]);
            //console.log('f--', fileName);
            if (list[i] === fileName) {
                //console.log('Найдено:', list[i]);
                res.sendFile(fileName, options, function (err) {
                    if (err) {
                        next(err)
                    } else {
                        console.log('Sent:', fileName)
                    }
                })
                //return res.json('файл найден');
            }
        }
    });
}

// 8. Upload Image Controller
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //console.log('storage', req, file);
        const userAccessToken = req.headers.authorization;
        const userAccessTokenCheck = validateAccessToken(userAccessToken.split(' ')[1]);
        const dir = 'upload/' + userAccessTokenCheck.id;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: '5242880' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|doc|docx|xls|xlsx|xml|txt/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType && extname) {
            return cb(null, true)
        }
        console.log('не принимаем файл: ', file.originalname);
        cb('Неверный формат или размер файла')
    }
}).array('files', 5)

module.exports = {
    addTask,
    addMessageToTask,
    getAllTasks,
    getTaskDetail,
    getTaskDetailMessages,
    getCategories,
    getTaskFiles,
    deleteTask,
    updateTask,
    upload
}