const { Router } = require("express");
const { subemail } = require("../handlers/subsHandler");

const router = Router();

router.post("/subscribe_news", subemail);

module.exports = router;
