const { create, put, getAllReviews } = require("../controllers/reviewsController")




//obtener todas

exports.getAll = async (req, res) => {
    try {
        const result = await getAllReviews(req)
        return res.status(result.status || 200).json(result)
    } catch (error) {
        return res.status(500).json({ error: true, message: "Error al consultar la base de datos." })
    }
}


//crear las reviews


exports.createReview = async (req, res) => {
    try {
        const result = await create(req)
        return res.status(result.status || 200).json(result)
    } catch (error) {
        return res.status(500).json({ error: true, message: "Error al consultar la base de datos." })
    }

}

//editar las reviews

exports.editReview = async (req, res) => {
    try {
        const result = await put(req)
        return res.status(result.status || 200).json(result)
    } catch (error) {
        return res.status(500).json({ error: true, message: "Error al consultar la base de datos." })
    }
}