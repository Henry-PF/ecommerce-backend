const { Router } = require("express");
const router = Router();
const { login, forgoPassword, register, loginGoogle, googleCallback} = require("../handlers/authHandler");

router.get('/google',loginGoogle);
router.get('/callback',googleCallback);
router.post('/login',login);
router.post('/forgoPassword',forgoPassword);
router.post('/register',register);

module.exports = router;