const express = require('express');
const { Op, Sequelize } = require('sequelize');

const Review = require('../models/review');
const Footprint = require('../models/footprint');
const Destination = require('../models/destination');

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
            where : {destination_id},
            raw : true
        });

        res.send(review);
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
        let where = {};  // 검색 조건을 담을 객체

        // 검색어 처리
        if (req.query.search) {
            const search = req.query.search;
            where = {
                [Op.or]: [
                    { region_name: { [Op.like]: `%${search}%` } },
                    { country_name: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const order = req.query.sort === 'rating' ? [
            [sequelize.literal('AVG(review.rating)'), 'DESC']  // 리뷰 테이블을 사용하고 별점 순으로 정렬
        ] : [];  // 'rating'이 없으면 기본 순서대로

        const { count, rows: destinations } = await Destination.findAndCountAll({
            attributes: ['id', 'region_name', 'country_name', 'address', 'description', 'image_path'],
            where: where,  // 검색 조건 추가
            include: [{
                model: Review, // Review 모델을 포함하여 별점 순으로 정렬
                attributes: [],
                required: false  // review가 없으면 포함되지 않음
            }],
            limit: limit,
            offset: offset,
            order: order,  // 정렬 기준 추가
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