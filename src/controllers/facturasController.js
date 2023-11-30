const { producto, factura, factura_detalle, statud, usuarios } = require("../db");
const { Op } = require("sequelize");
const { logger } = require("../components/logger");

exports.getFacturas = async () => {
    let result = {};
    try {
        let operation = await factura.findAll({
            include: [
                {
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    model: factura_detalle,
                    include: [
                        {
                            model: producto,
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        }
                    ]
                },
                {
                    model: usuarios,
                    attributes: ['id', 'usuario'],
                },
                {
                    model: statud,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
            ],
        });
        result = {
            data: operation,
            error: false,
            message: "Operacion realizada con exito"
        }
        logger.info(result);
    } catch (error) {
        logger.error(error.message);
        result = { message: error.message, error: true };
    }
    return result;
};

exports.getFacturasUsuario = async (data) => {
    let result = {};
    try {
        let operation = await factura.findAll({
            include: [
                {
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    model: factura_detalle,
                    include: [
                        {
                            model: producto,
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        }
                    ]
                },
                {
                    model: usuarios,
                    attributes: ['id', 'usuario'],
                },
                {
                    model: statud,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
            ],
            where: {
                id_usuario: {
                    [Op.eq]: data.id
                }
            }
        });
        result = {
            data: operation,
            error: false,
            message: "Operacion realizada con exito"
        }
        logger.info(result);
    } catch (error) {
        logger.error(error.message);
        result = { message: error.message, error: true };
    }
    return result;
};

exports.getFacturaById = async (data) => {
    console.log(data);
    let result = {};
    try {
        const facturaId = data.id;
        const facturaData = await factura.findByPk(facturaId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
                {
                    model: factura_detalle,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    include: [
                        {
                            model: producto,
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        }
                    ]
                },
                {
                    model: statud,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
            ],
            where: { id: { [Op.eq]: data.id } }
        });
        if (facturaData) {
            result = {
                data: facturaData,
                error: false,
                message: "Operacion realizada con exito"
            }
        } else {
            result = {
                data: facturaData,
                error: true,
                message: "Factura no encontrada"
            }
        }
        logger.info(result);
    } catch (error) {
        logger.error(error.message);
        result = { message: error.message, error: true };
    }
    return result;
};