const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSMS = () => {
    const sender = process.env.TWILIO_SENDER
    client.messages
    .create({
        body: '', //메세지 내용
        from: sender,
        to: '' //메세지 받을 번호
    })
    .then(message => console.log(message.sid))
    .catch(err => console.error(err));
};

module.exports = {
    sendSMS
};