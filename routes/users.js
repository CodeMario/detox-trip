const express = require('express');
const bcrypt = require('bcrypt')

const User = require('../models/user');
const Emergency = require('../models/emergency');
const {sendSMS} = require('../middlewares/smsHandler');

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

//비상 연락처 목록
router.get('/emergency-contact', async (req, res, next) => {
    try {
        const emergency = await Emergency.findAll({
            where: {user_id : req.user.id},
            include : [{
                model : User,
                attributes: ['is_agree_location']
            }]
        });

        response.result = emergency;
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
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
          response.result = true;
          res.status(200).send(response);
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
            response.result = false;
        }
        else {
            await Emergency.create({
                contact_name,
                phone_number,
                user_id : req.user.id
            });
            response.result = true;
        }
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

//비상 연락처 삭제
router.get('/emergency-contact/delete', async (req, res, next) => {
    try {
        const { id } = req.query;
        await Emergency.destroy({
            where : {id}
        });
        response.result = true;
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

//비상 메시지 전송
router.get('/sms', async (req, res, next) => {
    try {
        const {latitude, longitude ,address} = req.query;
        const address_list = address.split(',');
        //sendSMS(latitude, longitude, address_list[5]+address_list[3]+address_list[2]+address_list[1]+' '+address_list[0]);
        response.result = true;
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;