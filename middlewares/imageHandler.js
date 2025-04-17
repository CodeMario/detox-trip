const multer = require('multer');
const fs = require('fs');
const path = require('path');

//Multer 저장소 설정
const destinationStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images/destinations');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`);
    },
});

//Multer 필터 설정
const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(new Error('이미지만 허용'), false);
    }
};

//Multer 미들웨어 생성
const destinationUpload = multer({
    storage: destinationStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

//이미지 삭제
const deleteImage = (filePath) => {
    return new Promise((resolve, reject) => {
        const absolutePath = path.resolve(filePath);
        fs.unlink(absolutePath, (e) => {
            if (e) {
                console.error(`이미지 삭제 실패: ${absolutePath}`, e);
                reject(e);
            } else {
                console.log(`이미지 삭제 성공: ${absolutePath}`);
                resolve();
            }
        });
    });
};

module.exports = {
    destinationUpload,
    deleteImage
};