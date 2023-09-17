require('dotenv').config();
const path = require('path');
const express = require('express');
const logger = require('morgan');
const favicon = require('serve-favicon');
const sanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const passport = require('passport');

if (!process.env.NODE_ENV || (process.env.NODE_ENV && process.env.NODE_ENV !== 'test'))
    require('./config/db');
require('./config/passport');

const menuItemRouter = require('./routes/menuItem-router');
const ordersRouter = require('./routes/order-router');
const profileRouter = require('./routes/profile-router');
const authRouter = require('./routes/auth-router');
const bearer = require('./middleware/bearer');
const ensureLoggedIn = require('./middleware/ensureLoggedIn');

const DEBUG = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() !== 'production' : true; // Fix DEBUG logic
const PORT = process.env.PORT || 3001;
const configureApp = (customMiddleware) => {

    const app = express();

    app.use(logger(DEBUG ? 'dev' : 'short'));
    app.use(express.json());
    app.use(favicon(path.join(__dirname, '../build', 'favicon.ico')));
    app.use(express.static(path.join(__dirname, 'build')));
    app.use(sanitize());
    app.use(cookieParser(process.env.COOKIE_SECRET));

    app.use(passport.initialize());

    app.use(express.urlencoded({ extended: true }));

    app.use(cors());

    // Dummy auth middleware or real middleware
    if (customMiddleware) {
        app.use(customMiddleware);
    }

    app.use(bearer);

    app.use('/menu', menuItemRouter);
    app.use('/orders', ensureLoggedIn, ordersRouter);
    app.use('/profile', ensureLoggedIn, profileRouter);
    app.use('/auth', authRouter);

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });

    return app;
}

const app = configureApp();

if (!process.env.NODE_ENV || (process.env.NODE_ENV && process.env.NODE_ENV !== 'test'))
    app.listen(PORT, () => {
        console.log(`Express app running on port ${PORT}`);
    });

module.exports = { app, configureApp };
