const Sequelize = require('sequelize');

module.exports = class Emergency extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            contact_name : {
                type : Sequelize.STRING(20),
                allowNull : false
            },
            phone_number : {
                type : Sequelize.STRING(20)
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'Emergency',
            tableName : 'emergency',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {}
};