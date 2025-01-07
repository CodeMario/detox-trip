const express = require('express');
const bcrypt = require('bcrypt')

const User = require('../models/user');
const Emergency = require('../models/emergency');

const router = express.Router();

//모든 유저 조회
router.get('/', async (req, res, next) => {
    try {
        const user = await User.findAll({
            attributes: ['login_id','nickname','is_active']
        });

        res.send(user)
    } catch (e) {
        console.error(e);
        next(e);
    };
});

//본인 정보 조회
router.get('/me', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where : { login_id : req.user.login_id },
            attributes: ['login_id','nickname','is_active']
        });

        res.send(user)
    } catch (e) {
        console.error(e);
        next(e);
    };
});

//아이디 중복 확인
router.get('/check-duplication', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where : { login_id : req.query.loginId }
        });

        if (user) { res.send('no') }
        else { res.send('ok') }

    } catch (e) {
        console.error(e);
        next(e);
    };
});

//회원가입
router.post('/signup', async (req, res, next) => {
    try {
        const {login_id, password, nickname} = req.body;
        const user = await User.findOne({
            where : {login_id}
        });

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

//회원 탈퇴
router.delete('/', async (req, res, next) => {
    try {
        await User.destroy({
            where : {id : req.user.id}
        });

        req.logout((e) => {
            if (e) { 
              return next(err);
          }
          res.send('ok');
          });
    } catch(e) {
        console.error(e);
        next(e);
    }
});

//비상연락처 등록
router.post('/emergency-contact', async (req, res, next) => {
    try {
        const {contact_name, phone_number} = req.body
        if (await Emergency.findOne({where : {phone_number, user_id : req.user.id}})){
            res.send('전화번호 중복');
        }
        else {
            await Emergency.create({
                contact_name,
                phone_number,
                user_id : req.user.id
            });
            res.send('ok')
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
});

//비상 연락처 삭제
router.delete('/emergency-contact/:phone_number', async (req, res, next) => {
    try {
        const phone_number = req.params.phone_number;
        await Emergency.destroy({
            where : {phone_number, user_id : req.user.id}
        });
        res.send('ok');
        
    } catch (e) {
        console.error(e);
        next(e);
    }
});

//비상 메시지 전송
router.post('/sms', async (req, res, next) => {
    try {
        console.log('예정')
        
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;