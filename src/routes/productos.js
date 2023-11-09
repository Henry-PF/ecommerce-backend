const { Router } = require("express");
const router = Router();
const {CreateProducto,getAllProducto,getOneProducto,DeleteProducto,UpdateProducto} = require("../handlers/productosHandler");

router.get("/", getAllProducto);
router.get("/:id", getOneProducto);
router.post("/", CreateProducto);
router.post("/delete", DeleteProducto);
router.post("/update", UpdateProducto);

module.exports = router;