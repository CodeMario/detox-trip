const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            login_id : {
                type : Sequelize.STRING(255),
                allowNull : false
            },
            password : {
                type : Sequelize.STRING(100)
            },
            nickname : {
                type : Sequelize.STRING(30),
                allowNull : false
            },
            is_admin : {
                type : Sequelize.BOOLEAN,
                defaultValue : false
            },
            provider : {
                type : Sequelize.STRING(30),
                allowNull : false
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
    static associate(db) {
        db.User.hasOne(db.Itinerary, {foreignKey: 'user_id', sourceKey: 'id', onDelete: "CASCADE"});
        db.User.hasMany(db.Emergency, {foreignKey: 'user_id', sourceKey: 'id', onDelete: "CASCADE"});
        db.User.hasMany(db.Footprint, {foreignKey: 'user_id', sourceKey: 'id', onDelete: "CASCADE"});
        db.User.hasMany(db.Post, {foreignKey: 'user_id', sourceKey: 'id', onDelete: "CASCADE"});
        db.User.hasMany(db.Comment, {foreignKey: 'user_id', sourceKey: 'id', onDelete: "CASCADE"});
        db.User.hasMany(db.Review, {foreignKey: 'user_id', sourceKey: 'id', onDelete: "CASCADE"});
        db.User.hasMany(db.Reaction, {foreignKey: 'user_id', sourceKey: 'id', onDelete: "CASCADE"});
    }
};