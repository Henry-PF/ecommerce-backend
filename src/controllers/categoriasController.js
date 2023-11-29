const { categoria } = require("../db");
const { Op } = require("sequelize");
const { logger } = require("../components/logger");

exports.getAll = async () => {
    let result = {};
    try {
        let operation = await categoria.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        if (operation) {
            result = {
                data: operation,
                error: false,
                message: "Operacion realizada con exito",
            };
        } else {
            result = {
                error: true,
                message: "Error al realizar su operacion",
            };
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};

exports.getOne = async (data) => {
    let result = {};
    try {
        let operation = await categoria.findOne({
            attributes: { exclude: ["createdAt", "updatedAt"] },
            where: { id: { [Op.eq]: data.id } },
        });
        if (operation) {
            result = {
                data: operation,
                error: false,
                message: "Operacion realizada con exito",
            };
        } else {
            result = {
                error: true,
                message: "Error al realizar su operacion",
            };
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};

exports.Delete = async (data) => {
    let result = {};
    console.log("data:", data);
    try {
        let operation = await categoria.update(
            { id_statud: data.id_statud },
            { where: { id: { [Op.eq]: data.id } } }
        );
      
        if (operation) {
            result = {
                data: operation,
                error: false,
                message: "Operacion realizada con exito",
            };
        } else {
            result = {
                error: true,
                message: "Error al realizar su operacion",
            };
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};

exports.Update = async (data) => {
    let result = {};
    console.log(data.dato.nombre);
    try {
        let operation = await categoria.update(data.dato, {
            where: { id: { [Op.eq]: data.id } },
        });
        console.log("updated:", operation);

        if (operation) {
            result = {
                data: operation,
                error: false,

                message: "Operacion realizada con exito",
            };
        } else {
            result = {
                error: true,
                message: "Error al realizar su operacion",
            };
        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};

exports.Create = async (data) => {
    let result = {};
    try {
        let operation = await categoria.create(data);
        if (operation) {
            result = {
                data: operation,
                error: false,
                message: "Operacion realizada con exito",
            };
        } else {
            result = {
                error: true,
                message: "Error al realizar su operacion",
            };

        }
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};
