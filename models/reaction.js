const Sequelize = require('sequelize');

module.exports = class Reaction extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true,
                autoIncrement : true
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'Reaction',
            tableName : 'reaction',
            paranoid : false,
            charset : 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Reaction.belongsTo(db.Post, {foreignKey: 'post_id', sourceKey: 'id'});

        db.Reaction.belongsTo(db.User, {foreignKey: 'user_id', sourceKey: 'id'});
    }
};