const router = require('express').Router();
const authController = require('../controllers/controllerAuth');
const { check } = require('express-validator');
//const router = new Router();

router.get('/logins', authController.getAllUsers);
router.post('/registration',
    [
        check('email', 'Имя пользователя не может быть пустым').isEmail().normalizeEmail(),
        check('password', 'Пароль не может быть меньше 4 и больше 20 символов').isLength({ min: 4, max: 20 })
    ],
    authController.registerUser
);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/refresh', authController.refreshToken);
router.get('/access', authController.accessExpire);
/*router.post('/reg', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль не может быть меньше 4 и больше 10 символов').isLength({ min: 4, max: 10 })
], controller.registration);
router.get('/users', controller.getUsers);
router.get('/user', controller.getUser);*/

module.exports = router;