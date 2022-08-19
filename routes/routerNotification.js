const router = require('express').Router();
const events = require('events');

const controllerNotification = require('../controllers/controllerNotification.js');

router.get('/', controllerNotification.getUserNotify);
router.delete('/:id', controllerNotification.deleteUserNotify);

module.exports = router