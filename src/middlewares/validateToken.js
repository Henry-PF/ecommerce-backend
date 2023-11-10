const process = require('process');
const env = process.env;
const jwt = require('jsonwebtoken');

exports.validateToken = (req, res, next) => {
    try {
      const token = req.cookies["authorization"];
      if (token == null){
        return res.status(401).json({message:"Token no presente",error:true});
      }else{
        jwt.verify(token, env.SECRECT_TOKEN, (err, user) => {
          if (err){
            return res.status(403).json({message:"Error de autentificacion",error:true});
          } 
          req.user = user;
          next();
       });
      }
    } catch (error) {
      return res.status(401).json({ message: "No autorizado",error:true});
    }
};