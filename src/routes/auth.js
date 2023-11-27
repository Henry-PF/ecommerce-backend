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
        console.log('USUARIO', user);
        const token = jwt.sign({ user }, env.SECRECT_TOKEN, {
            expiresIn: "1h",
        });
        res.cookie('token', token, {httpOnly: true,  sameSite: 'None', secure: true });
        res.cookie('user', JSON.stringify(user), {httpOnly: true,  sameSite: 'None', secure: true });
        res.redirect('https://trendy-web-lemon.vercel.app');
    }
);
router.post('/login', login);
router.post('/forgoPassword', forgoPassword);
router.post('/register', register);

module.exports = router;
