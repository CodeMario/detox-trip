const express = require('express');

const Activity = require('../models/activity');
const Itinerary = require('../models/itinerary');
const { sequelize } = require('../models');

const router = express.Router();

const response = {result : true}

//목표 시간의 전체 시간 초과 여부 확인
async function checkTimeAvailability(user_id, target_time) {
    const itinerary = await Itinerary.findOne({
        where : {user_id},
        attributes : ['id']
    });

    const total_time = await Activity.findAll({
        where : {itinerary_id : itinerary.id},
        attributes : [[Activity.sequelize.fn("SUM", Activity.sequelize.col("target_time")), "time"]],
        group : ["itinerary_id"],
        raw:true
    });
    const limit_time = await Itinerary.findOne({
        where : {id : itinerary.id},
        attributes : ["total_time"],
        raw:true
    });

    if (total_time) {
        if (limit_time.total_time - Number(total_time[0].time) - target_time< 0) {
            return false;
        }
    }
    return itinerary.id;
}

//세부목표 조회
router.get('/', async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findOne({
            where : {user_id : req.user.id},
            attributes : ['id','total_time']
        });
        const activity = await Activity.findAll({
            where : {itinerary_id : itinerary.id},
            raw : true
        });

        response.result = {
            activities: activity,
            total_time: itinerary.total_time
        };
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//세부목표 등록
router.post('/', async (req, res, next) => {
    try {
        const {activity_name, target_time} = req.body;

        const temp = await checkTimeAvailability(req.user.id, target_time);
        if (temp) {
            await Activity.create({
                activity_name,
                target_time,
                itinerary_id : temp
            });
    
            response.result = "done"
        }
        else {
            response.result = "exceed total time"
        }
        res.status(200).send(response);
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

        response.result = true
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

        const temp = await checkTimeAvailability(req.user.id, target_time)
        if (temp) {
            await Activity.update({
                activity_name,
                target_time
            }, {
                where : {id : activity_id}
            });

            response.result = "done"
        }
        else {
            response.result = "exceed total time"
        }
        res.status(200).send(response);
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