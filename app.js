console.log('app.js 실행됨');
try {
    const express = require('express');
    const dotenv = require('dotenv');

    dotenv.config();

    const app = express();

    app.set('port', process.env.PORT || 3000);

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(app.get('port'), () => {
        console.log(app.get('port'), '번 포트에서 대기 중');
    });
} catch (err) {
    console.error('An error occurred:', err);
    process.exit(1);
}