const { carrito, detalle_carrito, producto, statud, usuarios, pagos, img_productos } = require("../db");
const { Op } = require("sequelize");
const { logger } = require("../components/logger");

exports.getCarrito = async (data) => {
    let result = "";
    try {
        if (data.id) {
            let dtaCarrito = await carrito.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        model: statud
                    },
                    {
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        model: detalle_carrito,
                        include: [
                            {
                                attributes: { exclude: ['createdAt', 'updatedAt'] },
                                model: producto,
                                include: [
                                    {
                                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                                        model: statud
                                    },
                                    {
                                        model: img_productos
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {
                    id_usuario: {
                        [Op.eq]: data.id
                    }
                }
            });
            if (dtaCarrito) {
                result = {
                    data: dtaCarrito,
                    error: false,
                    message: "Operacion realizada con exito"
                }
            } else {
                result = { error: true, message: "Data del carrito no disponible" };
            }
        } else {
            result = { error: true, message: "falta parametros" };
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return result = { message: error.message, error: true };
    }
}

exports.create = async (data) => {
    let result = "";
    try {
        if (data.id) {
            let newCarrito = await carrito.create({
                id_usuario: data.id,
                id_statud: 1,
                total: 0,
                fecha: new Date().toLocaleDateString().toString()
            });
            if (!newCarrito) {
                result = { error: true, message: "Error al crear el carrito" };
            } else {
                result = {
                    data: newCarrito,
                    error: false,
                    message: "Operacion realizada con exito"
                }
            }
        } else {
            result = { error: true, message: "falta parametros" };
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return result = { message: error.message, error: true };
    }
}

exports.addItem = async (data) => {
    let result = "";
    let aggProd;

    try {
        if (data.id_usuario) {
            let dtaCarrito = await carrito.findOne({
                where: {
                    id_usuario: {
                        [Op.eq]: data.id_usuario
                    }
                }
            });

            if (dtaCarrito) {
                let dtaProducto = await producto.findOne({
                    where: {
                        id: {
                            [Op.eq]: data.id_producto
                        }
                    }
                });

                if (dtaProducto) {
                    let existingItem = await detalle_carrito.findOne({
                        where: {
                            id_producto: {
                                [Op.eq]: dtaProducto.id
                            },
                            id_carrito: {
                                [Op.eq]: dtaCarrito.id
                            }
                        }
                    });

                    if (existingItem) {
                        existingItem.cantidad = parseFloat(existingItem.cantidad) + 1;
                        existingItem.subtotal = parseFloat((existingItem.cantidad).toFixed(2)) * parseFloat(dtaProducto.precio);
                        await existingItem.save();
                    } else {
                        let subtotal = parseFloat((data.cantidad).toFixed(2)) * parseFloat(dtaProducto.precio);
                        aggProd = await detalle_carrito.create({
                            id_producto: dtaProducto.id,
                            cantidad: data.cantidad,
                            subtotal: subtotal,
                            id_carrito: dtaCarrito.id
                        });

                        if (aggProd) {
                            await updateTotalCarrito({
                                monto: subtotal,
                                id_carrito: dtaCarrito.id
                            });
                        }
                    }

                    let dataCarrito = await updateTotalCarrito({
                        id_carrito: dtaCarrito.id
                    });

                    result = {
                        data: {
                            item: existingItem || aggProd,
                            carrito: dataCarrito
                        },
                        error: false,
                        message: "Operación realizada con éxito"
                    }
                } else {
                    result = { error: true, message: "Producto no existente" };
                }
            } else {
                result = { error: true, message: "Carrito no existente" };
            }
        } else {
            result = { error: true, message: "Faltan parámetros" };
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return { message: error.message, error: true };
    }
}


exports.removeItem = async (data) => {
    let result = "";
    try {
        if (data) {
            let dtaCarrito = await carrito.findOne({
                where: {
                    id_usuario: {
                        [Op.eq]: data.id_usuario
                    }
                }
            });

            if (dtaCarrito) {
                let dtaProducto = await producto.findOne({
                    where: {
                        id: {
                            [Op.eq]: data.id_producto
                        }
                    }
                });

                if (dtaProducto) {
                    let existingItem = await detalle_carrito.findOne({
                        where: {
                            id_producto: {
                                [Op.eq]: dtaProducto.id
                            },
                            id_carrito: {
                                [Op.eq]: dtaCarrito.id
                            }
                        }
                    });

                    if (existingItem) {
                        existingItem.cantidad = Math.max(0, parseFloat(existingItem.cantidad) - 1);

                        if (existingItem.cantidad === 0) {
                            await existingItem.destroy();
                        } else {
                            existingItem.subtotal = parseFloat((existingItem.cantidad).toFixed(2)) * parseFloat(dtaProducto.precio);
                            await existingItem.save();
                        }

                        await updateTotalCarrito({
                            id_carrito: dtaCarrito.id
                        });

                        result = {
                            data: {
                                item: existingItem,
                                carrito: await dtaCarrito.reload()
                            },
                            error: false,
                            message: "Operación realizada con éxito"
                        };
                    } else {
                        result = { error: true, message: "El producto no existe en el carrito" };
                    }
                } else {
                    result = { error: true, message: "Producto no existente" };
                }
            } else {
                result = { error: true, message: "Carrito no existente" };
            }
        } else {
            result = { error: true, message: "Faltan parámetros" };
        }

        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return { message: error.message, error: true };
    }
};

const updateTotalCarrito = async (data) => {
    try {
        if (data) {
            let dtaCarrito = await carrito.findOne({
                where: {
                    id: {
                        [Op.eq]: data.id_carrito
                    }
                }
            });

            if (dtaCarrito) {
                const total = await detalle_carrito.sum('subtotal', {
                    where: {
                        id_carrito: {
                            [Op.eq]: dtaCarrito.id
                        }
                    }
                });

                dtaCarrito.total = total || 0;

                await dtaCarrito.save();
                return dtaCarrito;
            } else {
                return { error: true, message: "Carrito no existente" };
            }
        } else {
            return { error: true, message: "Faltan parámetros" };
        }
    } catch (error) {
        logger.error(error.message);
        return { message: error.message, error: true };
    }
}

exports.deleteItem = async (data) => {
    let result = "";
    try {
        if (data) {
            let dtaCarrito = await carrito.findOne({
                where: {
                    id_usuario: {
                        [Op.eq]: data.id_usuario
                    }
                }
            });

            if (dtaCarrito) {
                let dtaProducto = await producto.findOne({
                    where: {
                        id: {
                            [Op.eq]: data.id_producto
                        }
                    }
                });

                if (dtaProducto) {
                    let existingItem = await detalle_carrito.findOne({
                        where: {
                            id_producto: {
                                [Op.eq]: dtaProducto.id
                            },
                            id_carrito: {
                                [Op.eq]: dtaCarrito.id
                            }
                        }
                    });

                    if (existingItem) {
                        await existingItem.destroy();

                        await updateTotalCarrito({
                            id_carrito: dtaCarrito.id
                        });

                        result = {
                            data: {
                                item: existingItem,
                                carrito: await dtaCarrito.reload()
                            },
                            error: false,
                            message: "Producto eliminado completamente del carrito"
                        };
                    } else {
                        result = { error: true, message: "El producto no existe en el carrito" };
                    }
                } else {
                    result = { error: true, message: "Producto no existente" };
                }
            } else {
                result = { error: true, message: "Carrito no existente" };
            }
        } else {
            result = { error: true, message: "Faltan parámetros" };
        }

        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return { message: error.message, error: true };
    }
};



exports.update = async (data) => {
    let result = "";
    try {
        if (data) {
            let dtaCarrito = await carrito.findOne({
                where: {
                    id: {
                        [Op.eq]: data.id_carrito
                    }
                }
            });
            if (dtaCarrito) {
                let updCarrito = await carrito.update({ data });
                if (updCarrito) {
                    result = {
                        error: false,
                        message: "Operacion realizada con exito"
                    }
                } else {
                    result = { error: true, message: "Error al actualizar el carrito" };
                }
            } else {
                result = { error: true, message: "carrito no existente" };
            }
        } else {
            result = { error: true, message: "falta parametros" };
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return result = { message: error.message, error: true };
    }
}

exports.Delete = async (data) => {
    let result = "";
    try {
        if (data.id) {
            let dltData = await detalle_carrito.detroy({
                where: {
                    id_usuario: {
                        [Op.eq]: data.id
                    }
                }
            })
            if (dltData) {
                let dltcarrito = await carrito.detroy({
                    where: {
                        id_usuario: {
                            [Op.eq]: data.id
                        }
                    }
                });
                if (dltcarrito) {
                    result = {
                        data: dltcarrito,
                        error: false,
                        message: "Operacion realizada con exito"
                    }
                } else {
                    result = { error: true, message: "Error al eliminar la data de carrito" };
                }
            } else {
                result = { error: true, message: "Error al eliminar la data de detalle del carrito" };
            }
        } else {
            result = { error: true, message: "falta parametros" };
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return result = { message: error.message, error: true };
    }
}