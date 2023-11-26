const { create, put, getProductReview, del, } = require("../controllers/productsReviewsController")




//obtener todas

exports.getReview = async (req, res) => {
    try {
        const result = await getProductReview(req.params)
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

//eliminar las reviews
exports.deleteReviews = async (req, res) => {
    try {
        const result = await del(req)
        return res.status(result.status || 200).json(result)

    } catch (error) {
        return res.status(500).json({ error: true, message: "Error al consultar la base de datos." })

    }
}