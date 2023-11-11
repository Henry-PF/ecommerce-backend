const {getAll,getOne,Delete,Update,Create} = require("../controllers/productosController");
const { logger } = require("../components/logger");

exports.CreateProducto =async (req, res) => {
    let result = {};
    try {
        if(req.body){
            result = await Create(req.body,req.files);
        }else{
            result = {message:"faltan campos",error:true}
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
exports.getAllProducto =async (req, res) => {
    let result = {};
    try {
        result = await getAll(req.query);
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
exports.getOneProducto =async (req, res) => {
    let result = {};
    try {
        if(req.params){
            result = await getOne(req.params)
        }else{
            result = {message:"faltan campos",error:true}
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
exports.DeleteProducto =async (req, res) => {
    let result = {};
    try {
        if(req.body){
            result = await Delete(req.body)
        }else{
            result = {message:"faltan campos",error:true}
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
exports.UpdateProducto =async (req, res) => {
    let result = {};
    try {
        if(req.body){
            result = await Update(req.body,req.files)
        }else{
            result = {message:"faltan campos",error:true}
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
