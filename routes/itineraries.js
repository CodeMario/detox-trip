const express = require('express');

const Itinerary = require('../models/itinerary');

const router = express.Router();

//여행일정 조회
router.get('/', async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findOne({
            where : { user_id : req.user.id }
        });
        if (itinerary) {
            res.send(itinerary);
        }
        else {
            res.send('empty');
        }
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