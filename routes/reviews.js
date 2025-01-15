const express = require('express');

const Review = require('../models/review');
const Footprint = require('../models/footprint');

const router = express.Router();

//리뷰 전체 조회
router.get('/', async (req, res, next) => {
    try {
        const review = await Review.findAll({
            raw : true
        });

        res.send(review);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//개인 리뷰 조회
router.get('/me', async (req, res, next) => {
    try {
        const review = await Review.findOne({
            where : {id : req.user.id},
            raw : true
        });

        res.send(review);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//선택 리뷰 조회
router.get('/this', async (req, res, next) => {
    try {
        const {destination_id} = req.query;
        const review = await Review.findAll({
            where : {destination_id},
            raw : true
        });

        res.send(review);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//리뷰 리마인더
router.get('/remainder', async (req, res, next) => {
    try {
        const review = await Footprint.findAll({
            where : {user_id : req.user.id},
            raw : true
        });

        res.send(review);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//리뷰 등록
router.post('/', async (req, res, next) => {
    try {
        const {destination_id, r_content, r_posted_time, rating} = req.body;

        await Review.create({
            r_content,
            r_posted_time,
            rating,
            user_id : req.user.id,
            destination_id
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//리뷰 수정
router.post('/update', async (req, res, next) => {
    try {
        const {review_id, r_content, r_posted_time, rating} = req.body;

        await Review.update({
            r_content,
            r_posted_time,
            rating
        },{
            where : {id : review_id}
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//리뷰 삭제
router.get('/delete', async (req, res, next) => {
    try {
        const {review_id} = req.query;

        await Review.destroy({
            where : {id : review_id}
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;