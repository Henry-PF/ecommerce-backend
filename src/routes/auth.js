const { Router } = require("express");
const router = Router();
const { login, forgoPassword, register, loginGoogle, googleCallback } = require("../handlers/authHandler");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const process = require("process");
const env = process.env;

router.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; connect-src 'self' https://trendy-web-lemon.vercel.app/; img-src 'self'");
    next();
});

router.get('/google', loginGoogle);

router.get('/callback', passport.authenticate('google', { failureRedirect: 'https://trendy-web-lemon.vercel.app' }),
    function (req, res) {
        const user = req.user;
        const token = jwt.sign({ user }, env.SECRECT_TOKEN, {
            expiresIn: "1h",
        });
        res.cookie('token', token,{ 
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            path: "https://trendy-web-lemon.vercel.app",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.cookie('user', JSON.stringify(user),{ sameSite: 'none', secure: true });
        res.redirect('https://trendy-web-lemon.vercel.app/')
    }
);
router.post('/login', login);
router.post('/forgoPassword', forgoPassword);
router.post('/register', register);

module.exports = router;
