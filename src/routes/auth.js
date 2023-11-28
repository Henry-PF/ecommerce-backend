const { Router } = require("express");
const router = Router();
const { login, forgoPassword, register, loginGoogle, googleCallback } = require("../handlers/authHandler");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const process = require("process");
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");
const env = process.env;

router.post('/success', (req, res) => {
    res.json({
        user: req.session.user
    });
});

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/callback', passport.authenticate('google', { failureRedirect: '/failure' }),
    (req, res) => {
        const user = req.user;
        const token = jwt.sign({ user }, env.SECRECT_TOKEN, {
            expiresIn: "1h",
        });
        // req.session.user = user;
        // res.cookie('token', token);
        // res.cookie('user', JSON.stringify(user));
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('user', user, {
                sameSite: 'lax',
                httpOnly: true,
                path: '/',
                secure: true,
                maxAge: 60 * 60 * 24 * 7 * 52
            })
        )
        console.log(req.isAuthenticated());

        res.redirect('http://localhost:3001')
    }
);



router.post('/login', login);
router.post('/forgoPassword', forgoPassword);
router.post('/register', register);

module.exports = router;