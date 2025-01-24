const express = require('express');

const Activity = require('../models/activity');
const Itinerary = require('../models/itinerary');
const { sequelize } = require('../models');

const router = express.Router();

const response = {result : true}

//세부목표 조회
router.get('/', async (req, res, next) => {
    try {
        const activity = await Activity.findAll({
            where : {user_id : req.user.id},
            raw : true
        });

        res.send(activity);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//세부목표 등록
router.post('/', async (req, res, next) => {
    try {
        const {itinerary_id, activity_name, target_time} = req.body;
        const total_time = await Activity.findAll({
            attributes : [[Activity.sequelize.fn("SUM", Activity.sequelize.col("target_time")), "time"]],
            group : ["itinerary_id"],
            raw:true
        });
        const limit_time = await Itinerary.findOne({
            where : {id : itinerary_id},
            attributes : ["total_time"],
            raw:true
        });

        if (total_time) {
            if (limit_time.total_time - Number(total_time[0].time) < 0) {
                res.send('목표시간 초과');
            }
        }

        await Activity.create({
            activity_name,
            target_time,
            itinerary_id
        });
        res.send("ok");

    } catch(e) {
        console.log(e);
        next(e);
    }
});

//목표 달성
router.post('/success', async (req, res, next) => {
    try {
        const {activityId} = req.body;
        await Activity.update({
            is_success : true
        },{
            where : {id : activityId}
        });

        res.status(200).send(response);

    } catch(e) {
        console.log(e);
        next(e);
    }
});

//세부목표 수정
router.post('/update', async (req, res, next) => {
    try {
        const {activity_id, activity_name, target_time} = req.body

        await Activity.update({
            activity_name,
            target_time
        }, {
            where : {id : activity_id}
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//세부목표 삭제
router.get('/delete', async (req, res, next) => {
    try {
        const {activity_id} = req.query

        await Activity.destroy({
            where : {id:activity_id}
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;