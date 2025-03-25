const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

const User = require('./user');
const Itinerary = require('./itinerary');
const Activity = require('./activity');
const Emergency = require('./emergency');
const Destination = require('./destination');
const Footprint = require('./footprint');
const Post = require('./post');
const Comment = require('./comment');
const Review = require('./review');
const Reaction = require('./reaction');

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config);

db.sequelize = sequelize;

db.User = User;
db.Itinerary = Itinerary;
db.Activity = Activity;
db.Emergency = Emergency;
db.Destination = Destination;
db.Footprint = Footprint;
db.Post = Post;
db.Comment = Comment;
db.Review = Review;
db.Reaction = Reaction;

User.init(sequelize);
Itinerary.init(sequelize);
Activity.init(sequelize);
Emergency.init(sequelize);
Destination.init(sequelize);
Footprint.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Review.init(sequelize);
Reaction.init(sequelize);

User.associate(db);
Itinerary.associate(db);
Activity.associate(db);
Emergency.associate(db);
Destination.associate(db);
Footprint.associate(db);
Post.associate(db);
Comment.associate(db);
Review.associate(db);
Reaction.associate(db);

module.exports = db;
