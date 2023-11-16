const { createReview, editReview, getAll, deleteReviews } = require("../handlers/reviewsHandler")

const router = require("express").Router()

//obtenerTodas
router.get("/", getAll)
//create Review
router.post("/", createReview)
//edit review
router.post("/", editReview)
//delete
router.post("/", deleteReviews)

module.exports = router