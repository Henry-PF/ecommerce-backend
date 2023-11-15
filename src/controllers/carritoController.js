const {carrito,detalle_carrito,producto,statud,usuarios,pagos} = require("../db");
const {Op}=require("sequelize");
const { logger } = require("../components/logger");
exports.getCarrito = async (data)=>{
    let result = "";
    try{
        if(data.id){
            let dtaCarrito = await carrito.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include:[
                    {
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        model:statud
                    },
                    {
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        model:detalle_carrito,
                        include:[
                            {
                                attributes: { exclude: ['createdAt', 'updatedAt'] },
                                model:producto,
                                include:[
                                    {
                                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                                        model:statud
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where:{
                    id_usuario:{
                        [Op.eq]: data.id
                    }
                }
            });
            if(dtaCarrito){
                result = {
                    data: dtaCarrito,
                    error: false,
                    message:"Operacion realizada con exito"
                }
            }else{
                result = {error:true,message:"Data del carrito no disponible"};
            }
        }else{
            result = {error:true,message:"falta parametros"};
        }
        logger.info(result);
        return result;
    }catch(error){
        logger.error(error.message);
        return result={message : error.message,error:true};
    }
}

exports.create = async (data)=>{
    let result = "";
    try{
        if(data.id){
            let newCarrito= await carrito.create({
                id_usuario:data.id,
                id_statud:1,
                fecha: new Date().toLocaleDateString().toString()
            });
            if(!newCarrito){
                result = {error:true,message:"Error al crear el carrito"};
            }else{
                result = {
                    data: newCarrito,
                    error: false,
                    message:"Operacion realizada con exito"
                }
            }
        }else{
            result = {error:true,message:"falta parametros"};
        }
        logger.info(result);
        return result;
    }catch(error){
        logger.error(error.message);
        return result={message : error.message,error:true};
    }
}
exports.addItem = async (data)=>{
    let result = "";
    try{
        if (data) {
            let dtaCarrito = await carrito.findOne({
                where:{
                    id_usuario:{
                        [Op.eq]:data.id_usuario
                    }
                }
            });
            if(dtaCarrito){
                let dtaProducto = await producto.findOne({
                    where:{
                        id:{
                            [Op.eq]:data.id_producto
                        }
                    }
                });
                if (dtaProducto){
                    let subtotal = parseFloat((data.cantidad).toFixed(2)) * parseFloat(dtaProducto.precio);
                    let aggProd = await detalle_carrito.create({
                        id_producto:dtaProducto.id,
                        cantidad : data.cantidad,
                        subtotal : subtotal,
                        id_carrito: dtaCarrito.id
                    });
                    if(aggProd){
                        let dataCarrito =await updateTotalCarrito({
                            monto:subtotal,
                            id_carrito:dtaCarrito.id
                        })
                        result = {
                            data: {
                                item:aggProd,
                                carrito:dataCarrito
                            },
                            error: false,
                            message:"Operacion realizada con exito"
                        }
                    }
                }else{
                    result = {error:true,message:"producto no existente"};
                }
            }else{
                result = {error:true,message:"carrito no existente"};
            }
        }else{
            result = {error:true,message:"falta parametros"};
        }
        logger.info(result);
        return result;
    }catch(error){
        logger.error(error.message);
        return result={message : error.message,error:true};
    }
}

const updateTotalCarrito = async (data)=>{
    let result = "";
    try{
        if(data){
            let dtaCarrito = await carrito.findOne({
                where:{
                    id:{
                        [Op.eq]:data.id_carrito
                    }
                }
            });
            if(dtaCarrito){
                dtaCarrito.total += data.monto;
                dtaCarrito.save();
                result = dtaCarrito;
            }else{
                result = {error:true,message:"carrito no existente"};
            }
        }else{
            result = {error:true,message:"falta parametros"};
        }
        logger.info(result);
        return result;
    }catch(error){
        logger.error(error.message);
        return result={message : error.message,error:true};
    }
}

exports.update = async (data)=>{
    let result = "";
    try{
        if(data){
            let dtaCarrito = await carrito.findOne({
                where:{
                    id:{
                        [Op.eq]:data.id_carrito
                    }
                }
            });
            if(dtaCarrito){
                let updCarrito=await carrito.update({data});
                if(updCarrito){
                    result = {
                        error: false,
                        message:"Operacion realizada con exito"
                    }
                }else{
                    result = {error:true,message:"Error al actualizar el carrito"};
                }
            }else{
                result = {error:true,message:"carrito no existente"};
            }
        }else{
            result = {error:true,message:"falta parametros"};
        }
        logger.info(result);
        return result;
    }catch(error){
        logger.error(error.message);
        return result={message : error.message,error:true};
    }
}

exports.Delete = async (data)=>{
    let result = "";
    try{
        if(data.id){
            let dltData=await detalle_carrito.detroy({where:{
                id_usuario:{
                    [Op.eq]: data.id
                }
            }})
            if(dltData){
                let dltcarrito= await carrito.detroy({where:{
                    id_usuario:{
                        [Op.eq]: data.id
                    }
                }});
                if(dltcarrito){
                    result = {
                        data: dltcarrito,
                        error: false,
                        message:"Operacion realizada con exito"
                    }
                }else{
                    result = {error:true,message:"Error al eliminar la data de carrito"};
                }
            }else{
                result = {error:true,message:"Error al eliminar la data de detalle del carrito"};
            }
        }else{
            result = {error:true,message:"falta parametros"};
        }
        logger.info(result);
        return result;
    }catch(error){
        logger.error(error.message);
        return result={message : error.message,error:true};
    }
}