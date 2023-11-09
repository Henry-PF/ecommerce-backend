const {categoria} = require("../db");
const { Op } = require("sequelize");
const { logger } = require("../components/logger");
exports.getAll= async (data)=>{
    let result = {};
    try {
        let operation = categoria.findAll();
        if(operation){
            result = {
                data: operation,
                error: false,
                message:"Operacion realizada con exito"
            }
        }else{
            result = {
                error: true,
                message:"Error al realizar su operacion"
            }
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
    }
}
exports.getOne= async (data)=>{
    let result = {};
    try {
        let operation = categoria.findOne({where: {id:{[Op.eq]:data.id}}});
        if(operation){
            result = {
                data: operation,
                error: false,
                message:"Operacion realizada con exito"
            }
        }else{
            result = {
                error: true,
                message:"Error al realizar su operacion"
            }
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
    }
}
exports.Delete= async (data)=>{
    let result = {};
    try {
        let operation = categoria.Update({id_statud:2},{where: {id:{[Op.eq]:data.id}}});
        if(operation){
            result = {
                data: operation,
                error: false,
                message:"Operacion realizada con exito"
            }
        }else{
            result = {
                error: true,
                message:"Error al realizar su operacion"
            }
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
    }
}
exports.Update= async (data)=>{
    let result = {};
    try {
        let operation = categoria.Update(data.data,{where: {id:{[Op.eq]:data.id}}});
        if(operation){
            result = {
                data: operation,
                error: false,
                message:"Operacion realizada con exito"
            }
        }else{
            result = {
                error: true,
                message:"Error al realizar su operacion"
            }
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
    }
}
exports.Create= async (data)=>{
    let result = {};
    try {
        let operation = categoria.create(data);
        if(operation){
            result = {
                data: operation,
                error: false,
                message:"Operacion realizada con exito"
            }
        }else{
            result = {
                error: true,
                message:"Error al realizar su operacion"
            }
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
    }
}