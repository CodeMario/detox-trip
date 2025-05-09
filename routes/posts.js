const express = require('express');

const { Model } = require('sequelize');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Reaction = require('../models/reaction');
const { Op } = require('sequelize');

const router = express.Router();

const response = {result : true};

//게시글 전체 조회
router.get('/', async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let offset = (page - 1) * limit;
        let sort = req.query.sort || 'latest';
        let search = req.query.search || '';

        let order = [['id', 'DESC']];

        if (sort === 'popular') {
            order = [['like', 'DESC'], ['id', 'DESC']];
        }

        //검색 조건 추가
        let whereCondition = {};

        if (search) {
            whereCondition = {
                [Op.or]: [
                    //게시글 내용 검색
                    { p_content: { [Op.like]: `%${search}%` } },
                    //작성자 닉네임 검색
                    { '$User.nickname$': { [Op.like]: `%${search}%` } }
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
            where: whereCondition,
            order: order,
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
            include: [{
                    model: Comment,
                    include: 
                    {model: User,
                    attributes: ['nickname']}},
                {
                    model: User,
                    attributes: ['nickname']}
                ]
        });

        const isOwner = post.user_id === req.user.id;

        const hasReaction = await Reaction.findOne({
            where: { user_id: req.user.id, post_id: id }
        }) ? true : false;

        response.result = {
            post,
            isOwner,
            hasReaction
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
        const {id, c_content} = req.body;

        console.log(id,c_content)

        await Comment.create({
            post_id : id,
            c_content,
            c_posted_time: new Date(),
            user_id : req.user.id
        });

        response.result = true;
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//좋아요 증가
router.post('/like', async (req, res, next)=> {
    try {
        const {id} = req.body;

        const post = await Post.findByPk(id);
        post.like += 1;
        await post.save();

        await Reaction.create({
            user_id : req.user.id,
            post_id : id
        })

        response.result = true;
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e)
    }
});

//게시글 수정
router.post('/update', async (req, res, next) => {
    try {
        const {id, title, p_content} = req.body;

        await Post.update({
            title,
            p_content
        }, {
            where : {id}
        });

        response.result = true;
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//게시글 삭제
router.get('/delete', async (req, res, next) => {
    try {
        const {id} = req.query;

        await Post.destroy({
            where : {id}
        });

        response.result = true;
        res.status(200).send(response);
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

        response.result = true;
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;