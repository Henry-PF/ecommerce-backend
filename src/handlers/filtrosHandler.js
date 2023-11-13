const { buscarProductos } = require("../controllers/filtrosControllers");

exports.filtros = async (req, res) => {
    console.log(req.query);
    let result = {};
    try {
        if (req.body) {
            result = await buscarProductos(req.query);
        } else {
            result = { message: "Producto no Encontrado", error: true }
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message, error: true })
    }
}