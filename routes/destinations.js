const express = require('express');
const path = require('path');
const {destinationUpload, deleteImage} = require('../middlewares/imageHandler');
const Destination = require('../models/destination');
const Review = require('../models/review');
const Footprint = require('../models/footprint');
const { Op } = require('sequelize');

const router = express.Router();

const response = { result : true }

//전체 여행지 조회
router.get('/', async (req, res, next) => {
    try {
        const destination = await Destination.findAll({
            attributes: ['id','region_name','country_name',
                'address','description','image_path'],
            raw : true
        });

        response.result = destination;
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    };
});

//여행지 중복 확인
router.get('/check-duplication', async (req, res, next) => {
    try {
        const { country_name, region_name } = req.query
        if ( await Destination.findOne({where : {country_name, region_name}})) {
            res.send('no');
        }

        res.send('ok');
    } catch (e) {
        console.error(e);
        next(e);
    };
});

//여행지 등록
router.post('/', destinationUpload.single('image'), async (req, res, next) => {
    try {
        const {country_name, region_name, address, description} = req.body;

        await Destination.create({
            country_name,
            region_name,
            address,
            description,
            image_path : req.file.path
        });
        
        res.send('ok');
    } catch (e) {
        console.error(e);
        next(e);
    };
});

//여행지 수정
router.post('/update', destinationUpload.single('image'), async (req, res, next) => {
    try {
        const {destination_id , country_name, region_name, address, description} = req.body;
        const currentImagePath = await Destination.findOne({
            where : {id : destination_id} ,
            attributes : ['image_path']
        });

        await deleteImage(currentImagePath.image_path);

        await Destination.update({
            country_name,
            region_name,
            address,
            description,
            image_path : req.file.path
        }, {
            where : {id : destination_id}
        });
        
        res.send('ok');
    } catch (e) {
        console.error(e);
        next(e);
    };
});

//여행지 삭제
router.get('/delete', async (req, res, next) => {
    try {
        const {destination_id} = req.query;
        const imagePath = await Destination.findOne({
            where : {id : destination_id} ,
            attributes : ['image_path']
        });

        await deleteImage(imagePath.image_path);

        await Destination.destroy({
            where : {id : destination_id}
        });
        
        res.send('ok');
    } catch (e) {
        console.error(e);
        next(e);
    };
});

//여행지 추천
//일단 가장 값이 높은 하나만 찾기 위해 findOne 사용
//만약 상위 n개중 하나 뽑는식으로 다양한 가능성을 조금 준다면 findAll과 limit 조건 사용할듯
router.get('/recommend', async (req, res, next) => {
    try {
        const rating = await Review.findOne({
            attributes : ["destination_id", [Review.sequelize.fn("AVG", Review.sequelize.col("rating")), "result"]],
            group : ["destination_id"],
            order : [["result","DESC"]],
            raw : true
        });

        const visiting = await Destination.findOne({
            attributes : ["id", "total_visits"],
            order : [["total_visits", "DESC"]],
            raw : true
        });

        const recent = await Footprint.findOne({
            attributes : ["destination_id", [Footprint.sequelize.fn("COUNT", Footprint.sequelize.col("destination_id")), "result"]],
            group : ["destination_id"],
            order : [["result","DESC"]],
            raw : true
        });

        //값이 없을때를 대비한 예외처리
        const id_1 = rating ? rating.destination_id : null;
        const id_2 = visiting ? visiting.id : null;
        const id_3 = recent ? recent.destination_id : null;
        const id_list = [id_1,id_2,id_3].filter(id => id !== null)

        const destination_list = await Destination.findAll({
            where : {id : {[Op.in] : id_list}},
            raw : true
        });

        response.result = destination_list
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        next(e);
    };
});

module.exports = router;