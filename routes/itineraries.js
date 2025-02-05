const express = require('express');

const Itinerary = require('../models/itinerary');
const Activity = require('../models/activity');
const Destination = require('../models/destination');

const router = express.Router();

const response = {result : true}

//여행일정 정보 조회
router.get('/', async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findOne({
            where: { user_id: req.user.id },
            include: [{
                model: Activity,
                required: false
            },{
                model: Destination,
                attributes: ['region_name','country_name']
            }]
        });
        if (itinerary) {
            // Sequelize 객체를 JSON 객체로 변환
            const itineraryJSON = itinerary.toJSON();
            itineraryJSON.start_date = new Date(itineraryJSON.start_date).toISOString().split('T')[0];
            itineraryJSON.end_date = new Date(itineraryJSON.end_date).toISOString().split('T')[0];
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

        response.result = true;
        res.status(200).send(response);
    } catch(e) {
        console.log(e);
        next(e);
    }
});

//여행일정 수정
router.post('/update', async (req, res, next) => {
    try {
        const {destination_id, start_date, end_date, total_time} = req.body;
        const beforeItinerary = await Itinerary.findOne({
            where : { user_id : req.user.id },
            attributes : [ "start_date", "end_date", "total_time", "destination_id" ]
        });
        
        await Itinerary.update({
            start_date : start_date ? start_date : beforeItinerary.start_date,
            end_date : end_date ? end_date : beforeItinerary.end_date,
            total_time : total_time ? total_time : beforeItinerary.total_time,
            destination_id : destination_id ? destination_id : beforeItinerary.destination_id
        }, {
            where : {user_id : req.user.id}
        });

        response.result = true;
        res.status(200).send(response);
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