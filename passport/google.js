const passport = require('passport');
const Strategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
require('dotenv').config()

module.exports = () => {
    passport.use(
        new Strategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3152/auth/google/callback"
            },
            async function(accessToken, refreshToken, profile, done) {
                try {
                    const [user, created] = await User.findOrCreate({
                        where: { login_id: profile.emails[0].value },
                        defaults: {
                            login_id: profile.emails[0].value,
                            nickname: profile.displayName,
                            provider: 'google'
                        }
                    });
                    return done(null, user);
                } catch (e) {
                    return done(e);
                }
            }
        ));
    }
  