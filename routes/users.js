const express = require('express');
const bcrypt = require('bcrypt')

const User = require('../models/user');
const Emergency = require('../models/emergency');

const router = express.Router();

const response = {result : true}

//모든 유저 조회
router.get('/', async (req, res, next) => {
    try {
        const user = await User.findAll({
            attributes: ['login_id','nickname','is_active'],
            raw : true
        });

        response.result = user;
        res.status(200).send(response);
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
            attributes: ['login_id','nickname','is_active','is_admin'],
            raw : true
        });

        response.result = user;
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    };
});

//아이디 중복 확인
router.get('/check-duplication', async (req, res, next) => {
    try {
        const { loginId } = req.query;
        const user = await User.findOne({
            where : { login_id : loginId }
        });

        if (user) {response.result = false;}
        else {response.result = true;}
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    };
});

//회원가입
router.post('/signup', async (req, res, next) => {
    try {
        const {loginId, password, nickname} = req.body;

        const hash = await bcrypt.hash(password, 12);
        await User.create({
            login_id : loginId,
            password: hash,
            nickname,
            provider: 'local'
        });

        response.result = true;
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

//게정 할성화 및 비활성화
router.post('/activate', async (req, res, next) => {
    try {
        const {login_id, is_active} = req.body;

        await User.update({
            is_active
        }, {
            where : { login_id }
        });

        response.result = true;
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

//회원 탈퇴
router.get('/delete', async (req, res, next) => {
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
router.get('/emergency-contact/delete', async (req, res, next) => {
    try {
        const phone_number = req.query;
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