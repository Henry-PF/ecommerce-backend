const { Router } = require("express");
const router = Router();
const { filtros } = require("../handlers/filtrosHandler");

router.get("/search", filtros);


module.exports = router;