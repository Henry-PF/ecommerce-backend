const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const process = require("process");
const env = process.env;
const {translation,trans,setlocales} = require("../components/translation");

const router = Router();
const basename = path.basename(__filename);
const routes = {};

const payments = require("../controllers/paymentsController")

fs.readdirSync(path.join(__dirname, "/"))
    .filter((file) => {
        return (file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js");
    })
    .forEach((file) => {
        if(file !== basename){
            let nameEnpoint = file.split(".")[0];
            routes[nameEnpoint] =require(path.join(__dirname, "/", file));
        }
    }
);
router.get("/",function(req, res) {
    let {lang}  = req.query;
    setlocales(lang)

    res.render('welcome',{
        lang:lang,
        translation:translation(lang)
    });
});
Object.keys(routes).forEach(route=>{
    router.use("/"+route,routes[route]);
})

module.exports = router;