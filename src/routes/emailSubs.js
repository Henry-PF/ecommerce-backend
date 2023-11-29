const { Router } = require("express");
const { subemail, sendNews, unsubscribe } = require("../handlers/subsHandler");

const router = Router();

router.post("/subscribe_news", subemail);
router.post("/send_news", sendNews);
router.post("/unsubscribe", unsubscribe)

module.exports = router;
