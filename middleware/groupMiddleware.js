const { validateAccessToken } = require('../helpers/helper_token');

module.exports = function (groups) {

    return function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const accessToken = authHeader.split(' ')[1];

            if (!accessToken) {
                return res.status(401).send({ type: 'error', message: 'Неверный токен' });
            }

            const { group } = validateAccessToken(accessToken);

            if (groups !== group) {
                return res.status(403).send({ type: 'error', message: 'У Вас нет доступа' });
            }
            next();
        } catch (e) {
            return next('Что то не так с проверкой прав');
        }

    }

}