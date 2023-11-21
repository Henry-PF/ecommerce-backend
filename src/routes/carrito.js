const { Router } = require("express");
const router = Router();

const { create, getCarrito, addItem, Delete, update, removeItem, deteleItem } = require("../handlers//carritoHandler");

router.get("/:id", getCarrito);
router.post("/", create);
router.post("/addItem", addItem);
router.post("/removeItem", removeItem);
router.post("/deleteItem", deteleItem);
router.post("/update", update);
router.post("/delete", Delete);

module.exports = router;