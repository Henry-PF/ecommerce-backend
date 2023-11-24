const {getFacturas,getFacturaById} = require("../controllers/facturasController");
const { logger } = require("../components/logger");

exports.getAllFacturas =async (req, res) => {
    let result = {};
    try {
        result = await getFacturas();
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
exports.getOneFacturas =async (req, res) => {
    let result = {};
    try {
        if(req.params){
            result = await getFacturaById(req.params)
        }else{
            result = {message:"faltan campos",error:true}
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}