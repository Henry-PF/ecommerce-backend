const { Router } = require("express");
const router = Router();
const {
    CreateCategory,
    getAllCategory,
    getOneCategory,
    DeleteCategory,
    UpdateCategory,
    ActiveCategory,
} = require("../handlers/categoriaHandler");

router.get("/", getAllCategory);
router.get("/:id", getOneCategory);
router.post("/", CreateCategory);
router.post("/delete", DeleteCategory);
router.post("/update", UpdateCategory);

module.exports = router;
