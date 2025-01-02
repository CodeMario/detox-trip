const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            email : {
                type : Sequelize.STRING(255),
                allowNull : false
            },
            password : {
                type : Sequelize.CHAR(64)
            },
            nickname : {
                type : Sequelize.STRING(30),
                allowNull : false
            },
            is_admin : {
                type : Sequelize.BOOLEAN,
                defaultValue : false
            },
            has_social_login : {
                type : Sequelize.BOOLEAN,
                defaultValue : false
            },
            has_local_login : {
                type : Sequelize.BOOLEAN,
                defaultValue : false
            },
            is_active : {
                type : Sequelize.BOOLEAN,
                defaultValue : true
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'User',
            tableName : 'user',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {}
};