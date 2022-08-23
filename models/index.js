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
        console.log('connected..')
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
db.message = require('./modelMessage')(sequelize, DataTypes)
db.groups = require('./modelGroups')(sequelize, DataTypes)
db.notify = require('./modelNotify')(sequelize, DataTypes)

//db.sequelize.sync({ force: true }).then(() => { console.log('Все модели были заново созданы.') })
//db.sequelize.sync({ alter: true }).then(() => { console.log('Все модели были успешно обновлены.') })

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