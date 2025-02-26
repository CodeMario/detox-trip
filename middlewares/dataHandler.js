const cron = require('node-cron');
const { Op } = require('sequelize');
const { Itinerary, Footprint } = require('../models');
const moment = require('moment');

//종료일이 지난 일정은 리뷰 작성 단계로 전환
const moveExpiredItineraries = async () => {
    try {
        const today = moment().format('YYYY-MM-DD');

        const expiredItineraries = await Itinerary.findAll({
            where: { end_date: { [Op.lt]: today } }
        });

        if (expiredItineraries.length > 0) {
            const footprints = expiredItineraries.map(itinerary => ({
                completed_date: itinerary.end_date,
                user_id: itinerary.user_id,
                destination_id: itinerary.destination_id
            }));

            await Footprint.bulkCreate(footprints);
            await Itinerary.destroy({ where: { id: expiredItineraries.map(it => it.id) } });

            console.log(`[${today}] ${expiredItineraries.length} itineraries moved to Footprint and deleted.`);
        }
    } catch (error) {
        console.error('Error moving expired itineraries:', error);
    }
};

//한 달 이상 지난 리뷰 작성 단계 끝내기
const deleteOldFootprints = async () => {
    try {
        const today = moment().subtract(30, 'days').format('YYYY-MM-DD');

        const deletedRows = await Footprint.destroy({
            where: { completed_date: { [Op.lt]: today } }
        });

        console.log(`[${today}] ${deletedRows} old footprints deleted.`);
    } catch (error) {
        console.error('Error deleting old footprints:', error);
    }
};

//여행 일정 및 리뷰 작성 단계 기간 관리 함수
const startScheduler = () => {
    console.log('✅ Scheduled tasks are starting...');

    moveExpiredItineraries();
    deleteOldFootprints();

    cron.schedule('0 0 * * *', async () => {
        console.log('🔄 Running scheduled tasks at 00:00...');
        await moveExpiredItineraries();
        await deleteOldFootprints();
    });

    console.log('✅ Scheduled tasks are set up.');
};

module.exports = { startScheduler };