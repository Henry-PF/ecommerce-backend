const {login,forgoPassword,create} = require("../controllers/usuariosController");
const { logger } = require("../components/logger");
const passport = require("../auth/google");

exports.loginGoogle = passport.authenticate('google', { scope: ['profile'] })
exports.googleCallback = passport.authenticate('google', {
    successRedirect: "http://localhost:3001",
    failureRedirect: "/login",
    passReqToCallback: true
    }),(req, res)=>{
    // If you use "Content-Type": "application/json"
    // req.isAuthenticated is true if authentication was success else it is false
    res.json({auth: req.isAuthenticated()});
};
exports.login = async (req, res) => {
    let result = {};
    try {
        if(req.body){
            result = await login(req.body);
        }else{
            result = {message:"Faltan campos"}
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true});
    }
}
exports.forgoPassword = async (req, res) => {
    let result = {};
    try {
        if(req.body){
            result = await forgoPassword(req.body);
        }else{
            result = {message:"Faltan campos"}
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true});
    }
}
exports.register = async (req, res) => {
    let result = {};
    try {
        if(req.body){
            result = await create(req.body);
        }else{
            result = {message:"faltan campos",error:true}
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
};