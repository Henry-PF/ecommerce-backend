const { createReview, editReview, getAll } = require("../handlers/reviewsHandler")

const router = require("express").Router()

//obtenerTodas
router.get("/", getAll)

//create Review
router.post("/", createReview)
//edit review
router.patch("/", editReview)

//createMockUser
router.get("/mock", async function (req, res) {
    await require('../db').usuarios.create({ usuario: "unUsuario", password: "Aezakmi11", type: "Algo" })
    return res.json("Created MockUser")
})
module.exports = router