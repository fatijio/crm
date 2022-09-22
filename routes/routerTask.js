// router /tasks/
const router = require('express').Router();
const controllerTask = require('../controllers/controllerTask.js');
//const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const groupMiddleware = require('../middleware/groupMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware); // использовать для всех роутов один мидл

router.post('/addTask', controllerTask.upload, [
    check('title').escape().trim().isLength({ min: 5 }).withMessage('Заголовок не может быть пустым или коротким'),
    check('description').escape().trim().isLength({ min: 15 }).withMessage('Описание должно содержать подробный текст задачи')
], controllerTask.addTask);
router.get('/allTasks', controllerTask.getAllTasks);
router.get('/categories', controllerTask.getCategories);
router.get('/:id/:filename', controllerTask.getTaskFiles);
router.get('/:id', controllerTask.getTaskDetail);
router.get('/:id/:messages', controllerTask.getTaskDetailMessages);
router.post('/:id', [
    check('message').escape().trim().isLength({ min: 2 }).withMessage('Сообщение не может быть пустым')
], controllerTask.addMessageToTask);
router.put('/:id', groupMiddleware(1), controllerTask.updateTask);
router.delete('/:id', controllerTask.deleteTask);

module.exports = router