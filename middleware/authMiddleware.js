const { validateAccessToken } = require('../helpers/helper_token');

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            //console.log('не авторизован');
            return res.status(401).json('Не авторизован');
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            //console.log('бяка токен');
            return res.status(401).json('Проблемы с токеном');
        }

        const userData = validateAccessToken(accessToken);
        //console.log(userData)
        if (!userData) {
            //console.log('что то не так с токеном');
            return res.status(401).json({ type: 'error', message: 'Время сессии закончено, обновите страницу F5' });
        }

        next();
    } catch (e) {
        return next('Что то не так с проверкой авторизации');
    }

    //req.user = userData;
    //next(() => 'sadsad');

}