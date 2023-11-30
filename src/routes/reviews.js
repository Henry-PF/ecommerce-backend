const { createReview, editReview, getAll, deleteReviews, findReview } = require("../handlers/reviewsHandler")

const router = require("express").Router()

//Encontrar Review
router.get("/:id", findReview)
//obtenerTodas
router.get("/", getAll)
//create Review
router.post("/", createReview)
//edit review
router.post("/", editReview)
//delete
router.post("/delete", deleteReviews)
module.exports = router