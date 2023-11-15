const { Router } = require("express");
const router = Router();

const { create,getCarrito,addItem,Delete,update} = require("../handlers//carritoHandler");

router.get("/:id", getCarrito);
router.post("/", create);
router.post("/addItem", addItem);
router.post("/update", update);
router.post("/delete", Delete);

module.exports = router;