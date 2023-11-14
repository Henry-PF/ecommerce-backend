const { Router } = require("express");
const router = Router();
const { login, forgoPassword, register, loginGoogle, googleCallback } = require("../handlers/authHandler");

router.get('/google', loginGoogle);
router.get('/callback', googleCallback);
router.post('/login', login);
router.post('/forgoPassword', forgoPassword);
router.post('/register', register);

router.get('/user', (req, res) => {
    try {
        if (req.user) {
            console.log('Usuario autenticado:', req.user);
            res.json({
                user: req.user,
                success: true,
                message: 'successfull',
            });
        }
    } catch (error) {
        console.error('Error en la ruta /user:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;