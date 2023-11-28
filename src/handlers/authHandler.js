const { login, forgoPassword, create } = require("../controllers/usuariosController");
const { logger } = require("../components/logger");
const passport = require("../auth/google");

exports.loginGoogle = passport.authenticate('google', { session: false, scope: ['email', 'profile'] })

exports.googleCallback = passport.authenticate('google', { failureRedirect: "/login" }), (req, res) => {
    const user = req.user;
    res.cookie('userData', JSON.stringify(user));
    res.redirect('/');
}

exports.login = async (req, res) => {
    let result = {};
    try {
        result = await login(req.body);
        if (result) {
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: { message: "Error al intentar ingresar al sistema." } });
    }
}

exports.forgoPassword = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await forgoPassword(req.body);
        } else {
            result = { message: "Faltan campos" }
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
}
exports.register = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await create(req.body);
        } else {
            result = { message: "faltan campos", error: true }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true })
    }
};
