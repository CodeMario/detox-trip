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

module.exports = router;