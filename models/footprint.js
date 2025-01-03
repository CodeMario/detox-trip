const Sequelize = require('sequelize');

module.exports = class Footprint extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            completed_date : {
                type : Sequelize.DATE,
                allowNull : false
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'Footprint',
            tableName : 'footprint',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Footprint.belongsTo(db.User, {foreignKey: 'user_id', sourceKey: 'id'});
        db.Footprint.belongsTo(db.Destination, {foreignKey: 'destination_id', sourceKey: 'id'});
    }
};