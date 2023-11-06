const process = require('process');
const env = process.env;
const jwt = require('jsonwebtoken');

exports.validateToken = (req, res, next) => {
    try {
      const token = req.cookies["authorization"];
      if (token == null){
        return res.redirect("/admin/login");
      }else{
        jwt.verify(token, env.SECRECT_TOKEN, (err, user) => {
          if (err){
            return res.redirect("/admin/login");
          } 
          req.user = user;
          next();
       });
      }
    } catch (error) {
      return res.status(410).json({ message: "No autorizado" });
    }
};