const {
    create,
    update,
    findAll,
    FindID,
    Delete,
} = require("../controllers/usuariosController");
const { logger } = require("../components/logger");

exports.findAll = async (req, res) => {
    let result = {};
    try {
        result = await findAll();
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
};
exports.FindID = async (req, res) => {
    let result = {};
    try {
        if (req.params) {
            result = await FindID(req.params.id);
        } else {
            result = { message: "faltan campos", error: true };
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
};
exports.Delete = async (req, res) => {
    let result = {};

    try {
        if (req.body) {
            result = await Delete(req.body);
        } else {
            result = { message: "faltan campos", error: true };
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
};
exports.update = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await update(req.body);
        } else {
            result = { message: "faltan campos", error: true };
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
};
exports.create = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await create(req.body);
        } else {
            result = { message: "faltan campos", error: true };
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
};
