const { Router } = require("express");
const router = Router();
const { findAll, FindID, Delete, update, create } = require("../handlers/usuariosHandler")

router.get("/", findAll);
router.get("/:id", FindID);
router.post("/", create);
router.post("/delete", Delete);
router.post("/update", update);

module.exports = router;