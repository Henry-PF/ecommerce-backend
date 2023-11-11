const { Router } = require("express");
const {createOrder,captureOrder,cancelOrder} = require("../handlers/pagoHandler");

const router = Router();

router.post("/create-order", createOrder);
router.get("/capture-order", captureOrder);
router.get("/cancel-order", cancelOrder);

module.exports = router;