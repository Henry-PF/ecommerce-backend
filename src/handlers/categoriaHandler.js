const {
    getAll,
    getOne,
    Delete,
    Update,
    Create,
    Active,
} = require("../controllers/categoriasController");
const { logger } = require("../components/logger");

exports.CreateCategory = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await Create(req.body);
        } else {
            result = { message: "faltan campos", error: true };
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
};
exports.getAllCategory = async (req, res) => {
    let result = {};
    try {
        result = await getAll();
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
};
exports.getOneCategory = async (req, res) => {
    let result = {};
    try {
        if (req.params) {
            result = await getOne(req.params);
        } else {
            result = { message: "faltan campos", error: true };
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
};
exports.DeleteCategory = async (req, res) => {
    let result = {};
    console.log(req.body);
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

exports.UpdateCategory = async (req, res) => {
    let result = {};

    try {
        if (req.body) {
            result = await Update(req.body);
        } else {
            result = { message: "faltan campos", error: true };
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true });
    }
};
