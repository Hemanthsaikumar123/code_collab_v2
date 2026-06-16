const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const roomController = require("../controllers/roomController");

router.post("/", protect, roomController.createRoom);
router.post("/join", protect, roomController.joinRoom);
router.get("/:id", protect, roomController.getRoom);
router.get("/:id/members", protect, roomController.getRoomMembers);


module.exports = router; 