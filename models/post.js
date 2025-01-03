const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            title : {
                type : Sequelize.STRING(100),
                allowNull : false
            },
            p_content : {
                type : Sequelize.TEXT,
                allowNull : false
            },
            p_posted_time : {
                type : Sequelize.DATE,
                allowNull : false
            },
            like : {
                type : Sequelize.MEDIUMINT,
                defaultValue : 0
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'Post',
            tableName : 'post',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Post.hasMany(db.Comment, {foreignKey: 'post_id', sourceKey: 'id', onDelete: "CASCADE"});

        db.Post.belongsTo(db.User, {foreignKey: 'user_id', sourceKey: 'id'});
    }
};