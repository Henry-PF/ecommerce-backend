const { getCarrito, create, addItem, update, Delete, removeItem, deleteItem } = require("../controllers/carritoController");
const { logger } = require("../components/logger");


exports.create = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await create(req.body);
        } else {
            result = { message: "faltan campos", error: true }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true })
    }
}

exports.getCarrito = async (req, res) => {
    let result = {};
    try {
        if (req.params) {
            result = await getCarrito(req.params);
        } else {
            result = { message: "faltan campos", error: true }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true })
    }
}

exports.addItem = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await addItem(req.body);
        } else {
            result = { message: "faltan campos", error: true }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true })
    }
}

exports.removeItem = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await removeItem(req.body);
        } else {
            result = { message: "faltan campos", error: true }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true })
    }
}

exports.deteleItem = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await deleteItem(req.body);
        } else {
            result = { message: "faltan campos", error: true }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true })
    }
}

exports.Delete = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await Delete(req.body);
        } else {
            result = { message: "faltan campos", error: true }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true })
    }
}


exports.update = async (req, res) => {
    let result = {};
    try {
        if (req.body) {
            result = await update(req.body);
        } else {
            result = { message: "faltan campos", error: true }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true })
    }
}
