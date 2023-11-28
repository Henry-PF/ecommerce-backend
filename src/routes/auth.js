const { Router } = require("express");
const router = Router();
const { login, forgoPassword, register, loginGoogle, googleCallback } = require("../handlers/authHandler");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const process = require("process");
const env = process.env;

router.get('/google', loginGoogle);

router.get('/callback', passport.authenticate('google', { failureRedirect: 'https://trendy-web-lemon.vercel.app' }),
    function (req, res) {
        const user = req.user;
        const token = jwt.sign({ user }, env.SECRECT_TOKEN, {
            expiresIn: "1h",
        });
        req.cookie('token', token,{ httponly: false, sameSite: 'none', secure: true});
        req.cookie('user', JSON.stringify(user),{ httponly: false, sameSite: 'none', secure: true});
        res.cookie('token', token,{ httponly: false, sameSite: 'none', secure: true});
        res.cookie('user', JSON.stringify(user),{ httponly: false, sameSite: 'none', secure: true});
        res.redirect('https://trendy-web-lemon.vercel.app')
    }
);
router.post('/login', login);
router.post('/forgoPassword', forgoPassword);
router.post('/register', register);

module.exports = router;
