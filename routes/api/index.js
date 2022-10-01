const express = require("express");
const router = express.Router();

router.get("", async (req, res) => {
    res.send("Welcome to the API");
});
router.use("/logs/", require("./log"));
router.use("/user/", require("./user"));
router.use("/scoreBoard/", require("./scoreBoard"));

module.exports = router;
