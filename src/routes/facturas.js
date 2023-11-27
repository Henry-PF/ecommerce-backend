const { Router } = require("express");
const router = Router();
const { getAllFacturas, getOneFacturas } = require("../handlers/facturasHandler");

router.get("/", getAllFacturas);
router.get("/:id", getOneFacturas);

module.exports = router;