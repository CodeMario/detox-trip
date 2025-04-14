const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSMS = (latitude, longitude, address) => {
    const sender = process.env.TWILIO_SENDER;
    const recipient = '받는 사람 번호'; // 예: '+821012345678'

    const messageBody = `
긴급 상황입니다. 신고 부탁드립니다.
현재 위치
위도: ${latitude}
경도: ${longitude}
주소: ${address}
    `.trim(); // trim()은 앞뒤 공백 제거

    client.messages
        .create({
            body: messageBody,
            from: sender,
            to: recipient
        })
        .then(message => console.log('메시지 전송 성공:', message.sid))
        .catch(err => console.error('메시지 전송 오류:', err));
};

module.exports = {
    sendSMS
};