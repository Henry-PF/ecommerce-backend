const { createReview, editReview, deleteReviews, getReview } = require("../handlers/productsReviewHandler")

const router = require("express").Router()

//obtenerTodas
router.get("/:id", getReview)
//create Review
router.post("/", createReview)
//edit review
router.put("/", editReview)
//delete
router.delete("/", deleteReviews)

module.exports = router