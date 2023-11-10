const {getAll,getOne,Delete,Update,Create} = require("../controllers/statudsController");
const { logger } = require("../components/logger");

exports.CreateStatud =async (req, res) => {
    let result = {};
    try {
        if(req.body){
            result = await Create(req.body);
        }else{
            result = {message:"faltan campos",error:true}
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
exports.getAllStatud =async (req, res) => {
    let result = {};
    try {
        result = await getAll();
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}
exports.getOneStatud =async (req, res) => {
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
exports.DeleteStatud =async (req, res) => {
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
exports.UpdateStatud =async (req, res) => {
    let result = {};
    try {
        if(req.body){
            result = await Update(req.body)
        }else{
            result = {message:"faltan campos",error:true}
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({message:error.message,error:true})
    }
}