const {categoria} = require("../db");
const { Op } = require("sequelize");
const { logger } = require("../components/logger");
exports.getAll= async ()=>{
    let result = {};
    try {
        let operation = categoria.findAll({attributes:{exclude:['createdAt', 'updatedAt']}});
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
        return result={message : error.message,error:true};
    }
}
exports.getOne= async (data)=>{
    let result = {};
    try {
        let operation = categoria.findOne({
            attributes:{exclude:['createdAt', 'updatedAt']},
            where: {id:{[Op.eq]:data.id}}
        });
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
        return result={message : error.message,error:true};
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
        return result={message : error.message,error:true};
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
        return result={message : error.message,error:true};
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
        return result={message : error.message,error:true};
    }
}