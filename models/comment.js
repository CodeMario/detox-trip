const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            c_content : {
                type : Sequelize.TEXT,
                allowNull : false
            },
            c_posted_time : {
                type : Sequelize.DATE,
                allowNull : false
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'Comment',
            tableName : 'comment',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Comment.belongsTo(db.User, {foreignKey: 'user_id', sourceKey: 'id'});
        db.Comment.belongsTo(db.Post, {foreignKey: 'post_id', sourceKey: 'id'});
    }
};