const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const userRouter = require('./routes/userRouter');
const conversationRouter = require('./routes/conversationRouter')
const accountRouter = require('./routes/accountRouter')
const friendRequestRouter = require('./routes/friendRequestRouter')
const messageRouter = require('./routes/messageRouter')
const authRouter = require('./routes/authRouter')
const reportRouter = require('./routes/reportRouter')

const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();
app.use(fileUpload())
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: 52428800}));
app.use(express.urlencoded({ limit: 52428800, extended:true}));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Routes
app.use('/api/v3/users', userRouter);
app.use('/api/v3/conversations', conversationRouter);
app.use('/api/v3/messages', messageRouter);
app.use('/api/v3/accounts', accountRouter);
app.use('/api/v3/friendRequests', friendRequestRouter);
app.use('/api/v3/auths', authRouter);
app.use('/api/v3/reports',reportRouter);

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;