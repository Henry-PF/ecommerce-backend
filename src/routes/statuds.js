const { Router } = require("express");
const router = Router();
const { CreateStatud, getAllStatud, getOneStatud, DeleteStatud, UpdateStatud } = require("../handlers/statudHandler");

router.get("/", getAllStatud);
router.get("/:id", getOneStatud);
router.post("/", CreateStatud);
router.post("/delete", DeleteStatud);
router.post("/update", UpdateStatud);

module.exports = router;