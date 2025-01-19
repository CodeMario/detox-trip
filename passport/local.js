const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = () => {
    passport.use(
        new Strategy({
            usernameField : 'loginId',
            passwordField: 'password'},
            async (loginId, password, done) => {
                try {
                    const user = await User.findOne({
                        where: { login_id : loginId }
                    });
                    if (user && await bcrypt.compare(password, user.password))
                        done(null, user);
                    else
                    done(null, false, '아이디 또는 비밀번호가 틀렸습니다.');
                }
                catch (e) {
                    console.error(e);
                    return done(e);
                }
            }
        )
    );
}
  