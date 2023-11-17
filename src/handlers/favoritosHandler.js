const { getFavoritos, addFavorito, deleteFavs } = require("../controllers/favoritosController")

exports.getFavoritosHandler = async (req, res) => {
    try {
        const result = await getFavoritos(req.params.id)

        return res.status(result.status || 200).json(result)
    } catch (error) {
        return res.status(500).json({ error: true, message: "Error al consultar la base de datos." })
    }
}

exports.addFavoritosHandler = async (req, res) => {
    try {
        const result = await addFavorito(req.body)

        return res.status(result.status || 200).json(result)
    } catch (error) {
        console.error(error)

        return res.status(500).json({ error: true, message: "Error al consultar la base de datos." })
    }
}

exports.deleteFavoritosHandler = async (req, res) => {
    try {
        const result = await deleteFavs(req.body)

        return res.status(result.status || 200).json(result)
    } catch (error) {
        console.error(error)

        return res.status(500).json({ error: true, message: "Error al consultar la base de datos." })
    }
}