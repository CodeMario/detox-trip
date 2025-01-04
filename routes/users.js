const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    try {
        const {login_id, password, nickname} = req.body;
        const user = await User.findOne({
            where : {login_id}
        });

        if (user) {
            next('이미 등록된 사용자 아이디입니다.');
            return;
        }

        try {
            const hash = await bcrypt.hash(password, 12);
            await User.create({
                login_id,
                password: hash,
                nickname,
                provider: 'local'
            });
            res.redirect('/');

        } catch (e) {
            console.error(e);
            next(e);
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;