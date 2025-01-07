const express = require('express');
const multer = require('multer');
const path = require('path');

const Destination = require('../models/destination');

const router = express.Router();

//Multer 저장소 설정
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images/destinations');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`);
    }
});

//Multer 필터 설정
const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(new Error('이미지만 허용'), false);
    }
};

//Multer 미들웨어 설정
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

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
router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const {country_name, region_name, address, description} = req.body;

        await Destination.create({
            country_name,
            region_name,
            address,
            description,
            image_name : req.file.filename
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