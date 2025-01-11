const Sequelize = require('sequelize');

module.exports = class Activity extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            activity_name : {
                type : Sequelize.STRING(100),
                allowNull : false
            },
            target_time : {
                type : Sequelize.SMALLINT,
                allowNull : false
            },
            is_success : {
                type : Sequelize.BOOLEAN,
                defaultValue : false
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'Activity',
            tableName : 'activity',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Activity.belongsTo(db.Itinerary, {foreignKey: 'itinerary_id', sourceKey: 'id'});
    }
};