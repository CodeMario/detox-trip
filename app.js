const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const passport = require('passport');
const passportConfig = require('./passport');

const { sequelize } = require('./models');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const destinationsRouter = require('./routes/destinations');
const itinerariesRouter = require('./routes/itineraries');
const activitiesRouter = require('./routes/activities');
const reviewsRouter = require('./routes/reviews');
const postsRouter = require('./routes/posts');

require('dotenv').config()

const app = express();

passportConfig();

app.set('port', process.env.PORT || 3000);

sequelize.sync({ force:false })
    .then(() => console.log('데이터베이스 연결 성공'))
    .catch(e => console.error(e));

app.use(cookieParser(process.env.COOKIE_SECRET));
//내장된 body-parsar 역할
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: 'session-cookie'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/destinations', destinationsRouter);
app.use('/itineraries', itinerariesRouter);
app.use('/activities', activitiesRouter);
app.use('/reviews', reviewsRouter);
app.use('/posts', postsRouter);

//html에서 직접 리다이렉트 할 때 필요한 정적 경로
app.use(express.static(path.join(__dirname, 'views')));
//images 폴더에서 이미지 꺼내올 때 필요한 정적경로
app.use(express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});