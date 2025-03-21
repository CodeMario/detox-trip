const express = require('express');

const Post = require('../models/post');
const Comment = require('../models/comment');
const { Model } = require('sequelize');
const User = require('../models/user');
const { Op } = require('sequelize');

const router = express.Router();

const response = {result : true};

//게시글 전체 조회
router.get('/', async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let offset = (page - 1) * limit;
        let sort = req.query.sort || 'latest'; // 기본값 최신순
        let search = req.query.search || '';

        let order = [['id', 'DESC']]; // 최신순 (기본값)

        if (sort === 'popular') {
            order = [['like', 'DESC'], ['id', 'DESC']]; // 인기순 정렬
        }

        let whereCondition = {}; // 검색 조건 추가

        if (search) {
            whereCondition = {
                [Op.or]: [
                    { p_content: { [Op.like]: `%${search}%` } }, // 게시글 내용 검색
                    { '$User.nickname$': { [Op.like]: `%${search}%` } } // 작성자 닉네임 검색
                ]
            };
        }

        const post = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['nickname']
                }
            ],
            where: whereCondition, // 검색 조건 적용
            order: order, // 정렬 조건 적용
            limit: limit,
            offset: offset
        });

        response.result = post;
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

//게시글 선택 조회
router.get('/this', async (req, res, next) => {
    try {
        const {id} = req.query;

        const post = await Post.findOne({
            where: {id},
            include: [
                {model: Comment},
                {model: User, attributes: ['nickname']}
            ]
        });

        const isOwner = post.user_id === req.user.id;

        response.result = {
            post,
            isOwner
        };
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//게시글 등록
router.post('/', async (req, res, next) => {
    try {
        const {title, p_content} = req.body;

        await Post.create({
            title,
            p_content,
            p_posted_time: new Date(),
            user_id : req.user.id
        });

        response.result = true;
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//댓글 등록
router.post('/comment', async (req, res, next) => {
    try {
        const {id, c_content, c_posted_time} = req.body;

        await Comment.create({
            post_id : id,
            c_content,
            c_posted_time,
            user_id : req.user.id
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//게시글 수정
router.post('/update', async (req, res, next) => {
    try {
        const {post_id, title, p_content, like} = req.body;

        await Post.update({
            title,
            p_content,
            like
        }, {
            where : {id : post_id}
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//게시글 삭제
router.get('/delete', async (req, res, next) => {
    try {
        const {post_id} = req.query;

        await Post.destroy({
            where : {id : post_id}
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//댓글 삭제
router.get('/delete', async (req, res, next) => {
    try {
        const {comment_id} = req.query;

        await Comment.destroy({
            where : {id : comment_id}
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;