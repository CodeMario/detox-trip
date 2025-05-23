const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            r_content : {
                type : Sequelize.TEXT,
                allowNull : false
            },
            r_posted_time : {
                type : Sequelize.DATE,
                allowNull : false,
                defaultValue: Sequelize.NOW
            },
            rating : {
                type : Sequelize.FLOAT,
                allowNull : false
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'Review',
            tableName : 'review',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Review.belongsTo(db.User, {foreignKey: 'user_id', sourceKey: 'id'});
        db.Review.belongsTo(db.Destination, {foreignKey: 'destination_id', sourceKey: 'id'});
    }
};