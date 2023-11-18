const { Router } = require("express");
const router = Router();
const { login, forgoPassword, register, loginGoogle, googleCallback } = require("../handlers/authHandler");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const process = require("process");
const env = process.env;

router.get('/google', loginGoogle);

router.get('/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        const user = req.user;
        console.log(user);
        const token = jwt.sign({ user: req.user }, env.SECRECT_TOKEN, {
            expiresIn: "1h",
        });
        res.cookie('token', token);
        res.cookie('user', JSON.stringify(user));
        res.redirect('http://localhost:3001');
    }
);
router.post('/login', login);
router.post('/forgoPassword', forgoPassword);
router.post('/register', register);

module.exports = router;