const { Router } = require("express");
const router = Router();
const { login, forgoPassword, register, loginGoogle, googleCallback } = require("../handlers/authHandler");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const process = require("process");
const env = process.env;

router.post('/success', (req, res) => {
    res.json({
        user: req.session.user
    });
});

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/callback', passport.authenticate('google', {
    failureRedirect: `https://trendy-web-lemon.vercel.app/?login=false`
    // failureRedirect: `http://localhost:3001/?login=false`
}),
    (req, res) => {
        const user = req.user;
        const token = jwt.sign({ user }, env.SECRECT_TOKEN, {
            expiresIn: "1h",
        });
        const redirectURL = `https://trendy-web-lemon.vercel.app/?token=${token}&user=${JSON.stringify(user)}`;
        // const redirectURL = `http://localhost:3001/?token=${token}&user=${JSON.stringify(user)}`;
        res.redirect(redirectURL);
    }
);

router.post('/login', login);
router.post('/forgoPassword', forgoPassword);
router.post('/register', register);

module.exports = router;
