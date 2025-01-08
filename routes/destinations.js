const express = require('express');
const path = require('path');
const {destinationUpload, deleteImage} = require('../middlewares/imageHandler');
const Destination = require('../models/destination');

const router = express.Router();

//전체 여행지 조회
router.get('/', async (req, res, next) => {
    try {
        const destination = await Destination.findAll({
            attributes: ['id','region_name','country_name',
                'address','description','image_path']
        });

        res.send(destination);
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
router.get('/recommend', async (req, res, next) => {
    try {
        res.send('예정');
    } catch (e) {
        console.error(e);
        next(e);
    };
});

module.exports = router;