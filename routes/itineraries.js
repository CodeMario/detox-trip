const express = require('express');

const Itinerary = require('../models/itinerary');
const Activity = require('../models/activity');

const router = express.Router();

const response = {result : true}

//여행일정 및 세부 목표 조회
router.get('/', async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findOne({
            where: { user_id: req.user.id },
            include: [{
                model: Activity,
                required: false
            }]
        });
        if (itinerary) {
            // Sequelize 객체를 JSON 객체로 변환
            const itineraryJSON = itinerary.toJSON();
            response.result = itineraryJSON;
        } else {
            response.result = null;
        }
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//여행일정 등록
router.post('/', async (req, res, next) => {
    try {
        const {destination_id, start_date, end_date, total_time} = req.body;
        await Itinerary.create({
            start_date,
            end_date,
            total_time,
            user_id : req.user.id,
            destination_id
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//여행일정 수정
router.post('/update', async (req, res, next) => {
    try {
        const {itinerary_id, destination_id, start_date, end_date, total_time} = req.body;
        const beforeItinerary = await Itinerary.findOne({
            where : { id : itinerary_id },
            attributes : [ "start_date", "end_date", "total_time", "destination_id" ]
        });
        
        await Itinerary.update({
            start_date : start_date ? start_date : beforeItinerary.start_date,
            end_date : end_date ? end_date : beforeItinerary.end_date,
            total_time : total_time ? total_time : beforeItinerary.total_time,
            destination_id : destination_id ? destination_id : beforeItinerary.destination_id
        }, {
            where : {id : itinerary_id}
        });

        res.send('ok');
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//여행일정 삭제
router.get('/delete', async (req, res, next) => {
    try {
        const {itinerary_id} = req.query;

        await Itinerary.destroy({
            where : {id : itinerary_id}
        });
        
        res.send('ok');
    } catch (e) {
        console.error(e);
        next(e);
    };
});


module.exports = router;