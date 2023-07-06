const db = require('../models');
const User = db.users;
const Groups = db.groups;
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { generateTokens, validateAccessToken, validateRefreshToken, findRefreshToken, removeRefreshToken } = require('../helpers/helper_token');
const { getOneUserInfo } = require('../helpers/helper_user');

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    const email = req.body.email;

    const isUser = await User.findOne({ where: { email: email } });
    if (isUser) {
        res.status(400).send(`Пользователь с таким логином ${email} уже существует`);
    } else {
        const hashPassword = bcrypt.hashSync(req.body.password, 7);
        const login = email.slice(0, email.indexOf("@"));

        let newUser = {
            login: login,
            email: req.body.email,
            password: hashPassword,
            fio: req.body.fio,
            published: true,
            group_id: 2
        }

        const userCreated = await User.create(newUser);
        const tokens = await generateTokens({ userId: userCreated.id, userGroup: 2 });
        res.cookie('refreshToken', tokens.refresh_token, { maxAge: 51 * 60 * 60 * 1000, httpOnly: true }); // 48 hours


        return res.status(200).send({
            ...tokens,
            user: userCreated.email
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
<<<<<<< Updated upstream
        const user = await User.findOne({ where: { email: email } });
=======
        const user = await User.findOne({
            where: { email: email },
        });
>>>>>>> Stashed changes
        //console.log('user_data', user);
        //console.log('user_group', user.group.name);

        if (!user) {
            return res.status(400).json(
                {
                    notify: {
                        type: 'error',
                        message: 'Пользователь не найден',
                        detail: '',
                    }
                }
            )
        }

        const comparePasswords = await bcrypt.compare(password, user.password);

        if (!comparePasswords) {
            return res.status(400).json(
                {
                    notify: {
                        type: 'error',
                        message: 'Неверный логин или пароль',
                        detail: '',
                    }
                }
            )
        }

        const tokens = await generateTokens({ userId: user.id, userGroup: user.group_id });

        res.cookie('refreshToken', tokens.refresh_token, { maxAge: 51 * 60 * 60 * 1000, httpOnly: true }); // 48 hours

        return res.status(200).send({
            ...tokens,
            user: user.fio,
        })

    } catch (error) {
        return res.status(400).json(
            {
                notify: {
                    type: 'error',
                    message: 'Не удалось авторизоваться, повторите попытку позже',
                    detail: error.name,
                }
            }
        )
    }
}

const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        //console.log(refreshToken)
        if (!refreshToken) {
            return res.status(400).json('Вы не авторизованы !!!');
        }
        const removeToken = await removeRefreshToken(refreshToken);
        if (!removeToken) {
            return res.status(400).json('Вы не авторизованы !!!');
        }
        res.clearCookie('refreshToken');
        return res.status(200).json('Вы вышли');
    } catch (error) {
        return res.status(400).json(error);
    }
}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    //console.log('refreshToken', refreshToken);
    const userData = validateRefreshToken(refreshToken);
    const user = await getOneUserInfo(userData.id);
    //console.log('user------------->', user);
    //const tokenFromDatabase = findRefreshToken(refreshToken);
    //console.log('userData------------------', userData);
    //console.log('tokenFromDatabase------------------', tokenFromDatabase);

    if (!userData) {
        return res.status(404).send(
            {
                notify: {
                    type: 'error',
                    message: 'Авторизуйтесь заново',
                    detail: '',
                }
            }
        );
    }
    const tokens = await generateTokens({ userId: userData.id, userGroup: user.group_id });
    res.cookie('refreshToken', tokens.refresh_token, { maxAge: 51 * 60 * 60 * 1000, httpOnly: true });
    return res.status(200).send({
        ...tokens,
        user: userData.id
    })
}

const accessExpire = async (req, res) => {
    const query = req.query;
    const response = validateAccessToken(query.token);
    //console.log('response', response);
    if (response === false) {
        return res.json(
            {
                notify: {
                    type: 'error',
                    message: 'Необходимо заново авторизоваться',
                    detail: '',
                }
            }
        )
    }
    const userInfo = await getOneUserInfo(response.id);
    //console.log('userInfo', userInfo);
    return res.status(200).json({ isAuth: true, user: userInfo });
}

const getAllUsers = async (req, res) => {
    let users = await User.findAll();
    res.status(200).send(users);
}

module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    refreshToken,
    accessExpire,
    logoutUser
}