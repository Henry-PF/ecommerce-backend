const { createReview, editReview, getAll, deleteReviews, createReport } = require("../handlers/reviewsHandler")

const router = require("express").Router()

//obtenerTodas
router.get("/", getAll)

//create Review
router.post("/", createReview)
//edit review
router.put("/", editReview)
//delete
router.delete("/", deleteReviews)


// Crear reporte (nueva ruta para manejar la creación de reportes)
router.post("/report", async (req, res) => {
    try {
        const result = await createReport(req, res); // Llama al handler para crear reportes
        return res.status(result.status || 200).json(result);
    } catch (error) {
        return res.status(500).json({ error: true, message: "Error al procesar la creación del reporte" });
    }
});

//createMockUser
router.get("/mock", async function (req, res) {
    await require('../db').usuarios.create({ usuario: "unUsuario", password: "Aezakmi11", type: "Algo", googleId: "asohfdoahfdoj" })
    return res.json("Created MockUser")
})
module.exports = router