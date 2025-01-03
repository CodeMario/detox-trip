const Sequelize = require('sequelize');

module.exports = class Destination extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            region_name : {
                type : Sequelize.STRING(100),
                allowNull : false
            },
            country_name : {
                type : Sequelize.STRING(100),
                allowNull : false
            },
            address : {
                type : Sequelize.STRING(300),
                allowNull : false
            },
            description : {
                type : Sequelize.TEXT,
                allowNull : false
            },
            image_path : {
                type : Sequelize.STRING(150),
                allowNull : false
            },
            total_visits : {
                type : Sequelize.INTEGER,
                defaultValue : 0
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'Destination',
            tableName : 'destination',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Destination.hasMany(db.Itinerary, {foreignKey: 'destination_id', sourceKey: 'id', onDelete: "CASCADE"});
        db.Destination.hasMany(db.Review, {foreignKey: 'destination_id', sourceKey: 'id', onDelete: "CASCADE"});
    }
};