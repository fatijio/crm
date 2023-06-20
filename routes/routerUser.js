// router /tasks/
const router = require('express').Router();
const controllerUser = require('../controllers/controllerUser.js');
const authMiddleware = require('../middleware/authMiddleware');
const groupMiddleware = require('../middleware/groupMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware); // использовать для всех роутов один мидл

router.post('/add', controllerUser.addUser, [
    check('title').escape().trim().isLength({ min: 5 }).withMessage('Заголовок не может быть пустым или коротким'),
    check('description').escape().trim().isLength({ min: 15 }).withMessage('Описание должно содержать подробный текст задачи')
], controllerUser.addUser);
router.get('/list', controllerUser.getAllUsers);
//router.get('/:id', controllerUser.getUser);
// router.get('/:id/:messages', controllerTask.getTaskDetailMessages);
// router.post('/:id', [
//     check('message').escape().trim().isLength({ min: 2 }).withMessage('Сообщение не может быть пустым')
// ], controllerTask.addMessageToTask);
// router.put('/:id', groupMiddleware(1), controllerTask.updateTask);
router.put('/:id', groupMiddleware(1), controllerUser.updateUser);
//router.delete('/:id', controllerUser.removeUser);

module.exports = router