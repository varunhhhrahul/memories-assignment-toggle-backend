const express = require("express");
const router = express.Router();
const {
  createMemory,
  getAllMemories,
  getMyMemories,
  getMemory,
  updateMemory,
  deleteMemory,
} = require("../controllers/memory");
// WntBLcPjyQmaxJ7N;
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

//get all memories
router.get("/", getAllMemories);

//get my memories
router.get("/my-memory", getMyMemories);

// create Memory
router.post("/", createMemory);

//get single Memory
router.get("/:id", getMemory);

//update Memory
router.put("/:id", updateMemory);

//delete Memory
router.delete("/:id", deleteMemory);

module.exports = router;
