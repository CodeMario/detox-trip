const express = require('express');

const Post = require('../models/post');
const Comment = require('../models/comment');
const { Model } = require('sequelize');
const User = require('../models/user');

const router = express.Router();

const response = {result : true};

//게시글 전체 조회
router.get('/', async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let offset = (page - 1) * limit;

        const post = await Post.findAll({
            include:[
                {
                    model: User,
                    attributes: ['nickname']
                }
            ],
            limit: limit,
            offset: offset
        });

        response.result = post;
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//게시글 선택 조회
router.get('/this', async (req, res, next) => {
    try {
        const {post_id} = req.query;

        const post = await Post.findOne({
            where : {id : post_id},
            raw : true
        });

        res.send(post);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//게시글 등록
router.post('/', async (req, res, next) => {
    try {
        const {title, p_content, p_posted_time} = req.body;

        await Post.create({
            title,
            p_content,
            p_posted_time,
            user_id : req.user.id
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//댓글 등록
router.post('/comment', async (req, res, next) => {
    try {
        const {post_id, c_content, c_posted_time} = req.body;

        await Comment.create({
            post_id,
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