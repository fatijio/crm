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
router.get('/files/:filename', controllerTask.getTaskFiles);
router.get('/:id', controllerTask.getTaskDetail);
router.get('/:id/:messages', controllerTask.getTaskDetailMessages);
router.post('/:id', controllerTask.addMessageToTask);
router.put('/:id', controllerTask.updateTask);
router.delete('/:id', controllerTask.deleteTask);

// get product Reviews
router.get('/getTaskReviews/:id', controllerTask.getTaskReviews);

module.exports = router