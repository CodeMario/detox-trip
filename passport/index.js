const passport = require('passport');
const User = require('../models/user');
const local = require('./local');
const google = require('./google');

module.exports = () => {
    //어떤 정보를 cookie에 담을지(user.id)
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    //사용할 정보로 전환 (user_id -> user), req.user로 사용가능
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({
                where: { id },
                raw : true
            });
            if (user) return done(null, user);
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });

    local();
    google();
};