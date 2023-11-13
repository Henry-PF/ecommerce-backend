const {createOrder,captureOrder,cancelOrder} = require("../controllers/pagosController");
const { logger } = require("../components/logger");

exports.createOrder =async (req, res) => {
    let result = {};
    try {
        if(req.body){
            result = await createOrder(req, res);
        }else{
            result = {message:"faltan campos",error:true}
            res.status(200).json(result);
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
exports.captureOrder= async (req,res)=>{
    let result = {};
    try {
        if(req.body){
            result = await captureOrder(req, res);
        }else{
            result = {message:"faltan campos",error:true}
            res.status(200).json(result);
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
exports.cancelOrder= async(req,res)=>{
    let result = {};
    try {
        result = await cancelOrder(req, res);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}