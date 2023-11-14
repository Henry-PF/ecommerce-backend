const { Router } = require("express");
const { getFavoritosHandler, addFavoritosHandler, deleteFavoritosHandler } = require("../handlers/favoritosHandler");

const router = Router()

router.get("/", getFavoritosHandler)
router.post("/", addFavoritosHandler)
router.delete("/", deleteFavoritosHandler)

module.exports = router