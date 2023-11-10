const {categoria,producto,img_productos,favoritos_productos} = require("../db");
const { Op } = require("sequelize");
const { logger } = require("../components/logger");
const cloudinary = require("../config/cloudinary");

exports.getAll= async () =>{
    let result ={};
    try {
        let operation = await producto.findAll({
            included:[
                {
                    model:categoria,
                    attributes:{exclude:['createdAt', 'updatedAt','id']}
                },
                {
                    model:img_productos,
                    attributes:{exclude:['createdAt', 'updatedAt','id']}
                }
            ]
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
exports.getOne= async (data)=>{
    let result ={};
    try {
        if(data.id){
            let operation = await producto.findOne({
                included:[
                    {
                        model:categoria,
                        attributes:{exclude:['createdAt', 'updatedAt','id']}
                    },
                    {
                        model:img_productos,
                        attributes:{exclude:['createdAt', 'updatedAt','id']}
                    }
                ],
                where: {
                    id:{
                        [Op.eq]:data.id
                    }
                }
            })
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
        }else{
            result = {
                error: true,
                message:"faltan el id del producto"
            }
        }
        
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return result={message : error.message,error:true};
    }
}
exports.Delete= async (data) =>{
    let result ={};
    try {
        let operation = producto.Update({id_statud:2},{where: {id:{[Op.eq]:data.id}}});
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
exports.Update= async (data,files) =>{
    let result ={};
    try {
        if(data.data){
            let operation = producto.Update(data.data,{where: {id:{[Op.eq]:data.id}}});
            if(operation){
                /*let imgProduct = files;
                if(imgProduct > 0){
                    const validExtensions = ["png", "jpg", "jpeg"];
                    imgProduct.forEach(async (element) => {
                        const extension = element.mimetype.split("/")[1];
                        if (!validExtensions.includes(extension)) {
                            result = {
                                error: true,
                                message:`archivo no valido.`
                            }
                            logger.error(result);
                            return result;
                        }
                        const uploaded = await cloudinary.v2.uploader.upload(
                            element.tempFilePath
                        );
                        const { secure_url } = uploaded;
                        await img_productos.Update({
                            id_producto:operation.id,
                            url:secure_url
                        },{where: {id:{[Op.eq]:data.id}}})
                    });
                }*/
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
        }
        
    } catch (error) {
        logger.error(error.message);
        return result={message : error.message,error:true};
    }
}
exports.Create= async (data,files) =>{
    let result ={};
    try {
        const existingcategoria = await categoria.findOne({
            where: { 
                id:{
                    [Op.eq]:data.id_categoria
                } 
            },
        });

        if (!existingcategoria) {
            result = {
                error: true,
                message:`categoria ${data.id_categoria} no encontrada.`
            }
            logger.error(result);
            return result;
        }

        let operation = await producto.create({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            stock: data.stock,
            id_categoria: existingcategoria.id,
            id_statud: 1
        });
        let imgProduct = files;
        if(imgProduct > 0){
            const validExtensions = ["png", "jpg", "jpeg"];
            imgProduct.forEach(async (element) => {
                const extension = element.mimetype.split("/")[1];
                if (!validExtensions.includes(extension)) {
                    result = {
                        error: true,
                        message:`archivo no valido.`
                    }
                    logger.error(result);
                    return result;
                }
                const uploaded = await cloudinary.v2.uploader.upload(
                    element.tempFilePath
                );
                const { secure_url } = uploaded;
                await img_productos.Create({
                    id_producto:operation.id,
                    url:secure_url
                })
            });
        }
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