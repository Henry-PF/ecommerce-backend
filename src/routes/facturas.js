const { Router } = require("express");
const router = Router();
const { getAllFacturas, getOneFacturas, getAllFacturasUsuario } = require("../handlers/facturasHandler");

router.get("/", getAllFacturas);
router.get("/facturas_usuario/:id", getAllFacturasUsuario);
router.get("/:id", getOneFacturas);

module.exports = router;