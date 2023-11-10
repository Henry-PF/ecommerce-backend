const { Router } = require("express");
const router = Router();
const passport = require("passport");

router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // const user = req.user;
        // res.cookie('userData', JSON.stringify(user));
        res.redirect('/');
    }
);

module.exports = router;