const express = require('express');
const { Op, Sequelize } = require('sequelize');

const Review = require('../models/review');
const Footprint = require('../models/footprint');
const Destination = require('../models/destination');
const User = require('../models/user');

const router = express.Router();

const response = {result : true}

//개인 리뷰 조회
router.get('/', async (req, res, next) => {
    try {
        const review = await Review.findAll({
            where: { user_id: req.user.id },
            attributes: ['id', 'destination_id', 'r_content', 'rating'],
            include: [
                {
                    model: Destination,
                    as: 'Destination',
                    attributes: ['region_name']
                }
            ]
        });

        response.result = review
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//여행지 리뷰 조회
router.get('/this', async (req, res, next) => {
    try {
        const {destination_id} = req.query;
        const review = await Review.findAll({
            where: { destination_id },
            include: [
                {
                    model: User,
                    attributes: ['nickname'],
                    required: true
                }
            ]
        });

        response.result = review
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//전체 여행지 조회
router.get('/destinations', async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let offset = (page - 1) * limit;
        let where = {};

        //검색어 처리
        if (req.query.search) {
            const search = req.query.search;
            where = {
                [Op.or]: [
                    { region_name: { [Op.like]: `%${search}%` } },
                    { country_name: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        //정렬 순서 처리
        const order = req.query.sort === 'rating' ? [
            [sequelize.literal('AVG(review.rating)'), 'DESC']
        ] : [];

        const { count, rows: destinations } = await Destination.findAndCountAll({
            attributes: ['id', 'region_name', 'country_name', 'address', 'description', 'image_path'],
            where: where,
            include: [{
                model: Review,
                attributes: [],
                required: false
            }],
            limit: limit,
            offset: offset,
            order: order,
            raw: true
        });

        response.result = {
            destinations: destinations,
            count: count
        }

        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

//리뷰 리마인더
router.get('/remainder', async (req, res, next) => {
    try {
        const review = await Footprint.findAll({
            where: { user_id: req.user.id },
            attributes: [
                'id', 'user_id', 'destination_id',
                [Sequelize.literal(`
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 FROM review
                            WHERE review.user_id = footprint.user_id
                            AND review.destination_id = footprint.destination_id
                        ) 
                        THEN true ELSE false 
                    END
                `), 'hasReview'],
                [Sequelize.col('destination.region_name'), 'region_name']
            ],
            include: [
                {
                    model: Destination,
                    attributes: [],
                    required: false
                }
            ],
            raw: true
        });

        response.result = review;
        res.status(200).send(response);
    } catch (e) {
        console.log(e);
        next(e);
    }
});

//리뷰 등록
router.post('/', async (req, res, next) => {
    try {
        const {destination_id, r_content, rating} = req.body;

        console.log(destination_id, r_content, rating)

        await Review.create({
            r_content,
            rating : rating ? rating : 0,
            user_id : req.user.id,
            destination_id
        });

        response.result = true;
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//리뷰 수정
router.post('/update', async (req, res, next) => {
    try {
        const {destination_id, r_content, rating} = req.body;

        await Review.update({
            r_content,
            r_posted_time : new Date(),
            rating : rating ? rating : 0
        },{
            where : {user_id : req.user.id,
                destination_id : destination_id
             }
        });

        response.result = true;
        res.status(200).send(response);
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