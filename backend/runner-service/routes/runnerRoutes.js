const express = require("express");
const router = express.Router();
const {runCode} = require("../controllers/runnerController");

router.post("/", runCode);

module.exports = router;