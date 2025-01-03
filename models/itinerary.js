const Sequelize = require('sequelize');

module.exports = class Itinerary extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            start_date : {
                type : Sequelize.DATE,
                allowNull : false
            },
            end_date : {
                type : Sequelize.DATE,
                allowNull : false
            },
            total_time : {
                type : Sequelize.SMALLINT,
                allowNull : false
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'Itinerary',
            tableName : 'itinerary',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Itinerary.hasMany(db.Activity, {foreignKey: 'itinerary_id', sourceKey: 'id', onDelete: "CASCADE"});

        db.Itinerary.belongsTo(db.User, {foreignKey: 'user_id', sourceKey: 'id'});
        db.Itinerary.belongsTo(db.Destination, {foreignKey: 'destination_id', sourceKey: 'id'});
    }
};