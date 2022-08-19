const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
global.__basedir = __dirname;

// middleware
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(bodyParser.json());

// routers
const router = require('./routes/productRouter.js');
const routerTask = require('./routes/routerTask.js');
const routerAuth = require('./routes/routerAuth.js');
const routerNotification = require('./routes/routerNotification.js');

app.use('/api/products', router);
app.use('/api/tasks', routerTask);
app.use('/api/auth', routerAuth);
app.use('/api/notifications', routerNotification);

//static Images Folder
//app.use('upload', express.static('upload'));

//port
const PORT = process.env.PORT || 8080;

//server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})