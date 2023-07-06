const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    //timezone: '+03:00',
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle

    }
}
)

sequelize.authenticate()
    .then(() => {
        console.log('Connected..')
    })
    .catch(err => {
        console.log('Error' + err)
    })

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

//db.products = require('./productModel.js')(sequelize, DataTypes)
//db.reviews = require('./reviewModel.js')(sequelize, DataTypes)
db.users = require('./modelUser.js')(sequelize, DataTypes)
db.tasks = require('./modelTasks.js')(sequelize, DataTypes)
db.refreshes = require('./modelRefreshToken.js')(sequelize, DataTypes)
db.status = require('./modelStatusTask.js')(sequelize, DataTypes)
db.category = require('./modelCategories.js')(sequelize, DataTypes)
db.message = require('./modelMessage.js')(sequelize, DataTypes)
db.groups = require('./modelGroups.js')(sequelize, DataTypes)
db.notify = require('./modelNotify.js')(sequelize, DataTypes)
db.files = require('./modelFiles.js')(sequelize, DataTypes)

// Создание первоначальных справочников
// db.sequelize.sync({ force: true }).then(() => {
  
//   // Статусы
//   db.status.bulkCreate([
//     { name: 'Обработка', color: '#bfbfbf', published: true },
//     { name: 'В работе', color: '#69b1ff', published: true },
//     { name: 'Доработка', color: '#36cfc9', published: true },
//     { name: 'Выполнено', color: '#52c41a', published: true }
//   ]).then(() => {
//     console.log('Создание списка статусов закончено');
//   }).catch(error => {
//     console.log('status creator', error)
//   });

//   // Категории
//   db.category.bulkCreate([
//     { name: 'Разработка', description: 'Разработка приложений и компонентов', published: true },
//     { name: 'Тестирование', description: 'Тестирование приложений и компонентов', published: true },
//     { name: 'Обновление', description: 'Обновление приложений и компонентов', published: true },
//   ]).then(() => {
//     console.log('Создание списка категорий закончено');
//   }).catch(error => {
//     console.log('category creator', error)
//   });

//   // Группы пользователей
//   db.groups.bulkCreate([
//     { name: 'Администратор', published: true },
//     { name: 'Пользователь', published: true },
//   ]).then(() => {
//     console.log('Создание списка групп закончено');
//   }).catch(error => {
//     console.log('group creator', error)
//   });
//   console.log('Все модели были заново созданы.') });

// Обновление текущих таблиц
//db.sequelize.sync({ alter: true }).then(() => { console.log('Все модели были успешно обновлены.') });

/*db.products.hasMany(db.reviews, {
    foreignKey: 'product_id',
    as: 'review'
})
db.reviews.belongsTo(db.products, {
    foreignKey: 'product_id',
    as: 'product'
})*/

//db.users.hasOne(db.groups, { foreignKey: 'user_id' });
//db.groups.hasMany(db.users);
db.users.belongsTo(db.groups, { foreignKey: 'group_id' });
db.users.hasMany(db.notify, { foreignKey: 'user_id' });
db.users.hasMany(db.notify, { foreignKey: 'from_user_id' });

db.files.belongsTo(db.users, { foreignKey: 'user_id' });
db.tasks.hasMany(db.files, { foreignKey: 'task_id' });
db.files.belongsTo(db.tasks, { foreignKey: 'task_id' });


db.users.hasOne(db.refreshes);

db.users.hasMany(db.tasks); // 01.08.2022 изменил с hasOne на hasMany
db.tasks.belongsTo(db.users);

db.status.hasOne(db.tasks, { foreignKey: 'status_id' });
db.tasks.belongsTo(db.status, { foreignKey: 'status_id' });

db.category.hasOne(db.tasks, { foreignKey: 'category_id' });
db.tasks.belongsTo(db.category, { foreignKey: 'category_id' });

db.users.hasMany(db.message, { foreignKey: 'user_id' });
db.message.belongsTo(db.users, { foreignKey: 'user_id' });

db.tasks.hasMany(db.message, { foreignKey: 'task_id' });
db.message.belongsTo(db.tasks, { foreignKey: 'task_id' });

module.exports = db