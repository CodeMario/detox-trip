const express = require('express');
const passport = require('passport');

const router = express.Router();

const response = {result : true}

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (user) req.login(user, loginError => res.status(200).send(response));
        else next(info);
    })(req, res, next);
});

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {res.status(200).send()}
);

router.get('/logout', (req, res, next) => {
    req.logout((e) => {
      if (e) { 
        return next(err);
    }
    res.redirect('/');
    });
});

module.exports = router;