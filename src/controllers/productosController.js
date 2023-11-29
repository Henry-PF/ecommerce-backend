const { categoria, producto, img_productos, favoritos_productos, productsReview, conn, producto_categorias } = require("../db");
const { Op, where } = require("sequelize");
const { logger } = require("../components/logger");
const cloudinary = require("../config/cloudinary");

exports.getAll = async (data) => {
    let result = {};
    try {

        //page = pagina
        const page = parseInt(data?.page) || 1
        //cantidad de productos por pagina
        const productsPerPage = 9

        //desplazamiento = numero de pagina - 1 * numero de productos 
        // (por ej: si pagina = 1 ==> el offset es 0, si pagina = 2 offset = 10), asi puede omitir cierta cant de productos
        //y devuelve los proximos 10 ( o los que esten definidos por la cantidad.)
        const offset = (page - 1) * productsPerPage

        //obtener categoria de producto (si aplica)
        const cat = data?.cat

        //esto es para verificar si cat es o no null
        let where = {}

        //si cat existe tambien filtra por categoria, recibida por query
        if (cat) {
            where.id_categoria = cat
        }

        const totalProducts = await producto.count({ where });

        let operation = await producto.findAll({
            //offset es la pagina
            offset,
            //limit es el limite de productos que trae por pagina.
            limit: productsPerPage,
            //aca la condicion
            where,

            include: [
                {
                    model: producto_categorias,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }
                },
                {
                    model: img_productos,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }
                }
            ]
        });
        if (operation) {
            const totalPages = Math.ceil(totalProducts / productsPerPage);
            result = {
                data: operation,
                totalProducts: totalProducts,
                totalPages: totalPages,
                error: false,
                message: "Operacion realizada con exito"
            }
        } else {
            result = {
                error: true,
                message: "Error al realizar su operacion"
            }
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return result = { message: error.message, error: true };
    }
}
exports.getOne = async (data) => {
    let result = {};
    try {
        if (data.id) {
            let operation = await producto.findOne({
                include: [
                    {
                        model: categoria,
                        attributes: { exclude: ['createdAt', 'updatedAt',] }
                    },
                    {
                        model: img_productos,
                        attributes: { exclude: ['createdAt', 'updatedAt',] }
                    },
                    {
                        model: productsReview,
                        attributes: { exclude: ['createdAt', 'updatedAt',] }

                    }
                ],
                where: {
                    id: {
                        [Op.eq]: data.id
                    }
                }
            })
            if (operation) {
                result = {
                    data: operation,
                    error: false,
                    message: "Operacion realizada con exito"
                }
            } else {
                result = {
                    error: true,
                    message: "Error al realizar su operacion"
                }
            }
        } else {
            result = {
                error: true,
                message: "faltan el id del producto"
            }
        }

        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return result = { message: error.message, error: true };
    }
}
exports.Delete = async (data) => {
    let result = {};
    try {
        let operation = producto.update({ id_statud: 2 }, { where: { id: { [Op.eq]: data.id } } });
        if (operation) {
            result = {
                data: operation,
                error: false,
                message: "Operacion realizada con exito"
            }
        } else {
            result = {
                error: true,
                message: "Error al realizar su operacion"
            }
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return result = { message: error.message, error: true };
    }
}
exports.Update = async (data, files) => {
    const result = {}
    try {
        if (data) {
            await conn.transaction(async function (t) {
                //obtener producto
                const product = await producto.findOne({
                    where: {
                        id: { [Op.eq]: data.id }
                    },
                    transaction: t
                })

                if (product) {

                    //datos de producto
                    const productData = {
                        ...data
                    }

                    //evitar que se pase el id 
                    delete productData["id"]

                    await product.update(productData, { transaction: t })

                    //si hay un solo archivo.
                    if (files && typeof files === "object") {
                        files = [files]
                    }

                    if (files?.length) {
                        //definir extensiones válidas
                        const validExtensions = ["png", "jpg", "jpeg"];

                        //validar archivos
                        await Promise.all(files.map(async (file) => {
                            //obtener extension del archivo
                            const extension = file.mimetype.split("/")[1]

                            //validar extension
                            if (!validExtensions.includes(extension)) {
                                result.error = true
                                result.message = "Archivo no valido"
                                logger.error(result)
                                return result
                            }

                            //subir imagen a cloudinary
                            const upload = await cloudinary.v2.uploader.upload(
                                file.tempFilePath
                            )

                            //obtener url
                            const { secure_url } = upload
                            console.log(secure_url)

                            //actualizar imagenes
                            await img_productos.update({
                                id_producto: product.id,
                                url: secure_url
                            }, {
                                where: {
                                    id_producto: {
                                        [Op.eq]: data.id
                                    }
                                },
                                transaction: t
                            })

                        })
                        )
                    }

                    result.message = "Cambios realizados con éxito"
                    result.status = 200

                } else {
                    result.message = "El producto solicitado no existe."
                    result.status = 404
                }
            })
        }
    } catch (error) {
        result.error = true
        result.message = "Se produjo un error al actualizar el producto solicitado"
        result.status = 500
        logger.error(result)
    }
    return result
}

exports.Create = async (data, files) => {
    let result = {};
    try {
        const existingcategoria = await categoria.findOne({
            where: {
                id: {
                    [Op.eq]: data.id_categoria
                }
            },
        });

        if (!existingcategoria) {
            result = {
                error: true,
                message: `categoria ${data.id_categoria} no encontrada.`
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
        let imgProduct = files.imagen;
        if (imgProduct) {
            console.log('IMAGEN', imgProduct);
            const validExtensions = ["png", "jpg", "jpeg"];
            // imgProduct.forEach(async (element) => {
            const extension = imgProduct.mimetype.split("/")[1];
            if (!validExtensions.includes(extension)) {
                result = {
                    error: true,
                    message: `archivo no valido.`
                }
                logger.error(result);
                return result;
            }
            const uploaded = await cloudinary.v2.uploader.upload(
                imgProduct.tempFilePath
            );
            const { secure_url } = uploaded;
            await img_productos.create({
                id_producto: operation.id,
                url: secure_url
                // })
            });
        }
        if (operation) {
            result = {
                data: operation,
                error: false,
                message: "Operacion realizada con exito"
            }
        } else {
            result = {
                error: true,
                message: "Error al realizar su operacion"
            }
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return result = { message: error.message, error: true };
    }
}

