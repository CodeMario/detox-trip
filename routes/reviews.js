const express = require('express');

const Review = require('../models/review');
const Footprint = require('../models/footprint');

const router = express.Router();

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