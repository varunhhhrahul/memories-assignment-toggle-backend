const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Memory = require("../models/Memory");

//@desc get all memories
//@route  GET /api/v1/memory
//@access private
exports.getAllMemories = asyncHandler(async (req, res, next) => {
  const memories = await Memory.find({
    privacy: "public",
  })
    .sort({
      createdAt: -1,
    })
    .populate("user");

  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories,
  });
});

//@desc get my memories
//@route  GET /api/v1/memory/my-memory
//@access private
exports.getMyMemories = asyncHandler(async (req, res, next) => {
  const memories = await Memory.find({
    user: req.user.id,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    success: true,
    count: memories.length,
    data: memories,
  });
});

//@desc get a single memory
//@route  GET /api/v1/memory/:id
//@access private
exports.getMemory = asyncHandler(async (req, res, next) => {
  const memory = await Memory.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate("user");
  res.status(200).json({
    success: true,
    data: memory,
  });
});

//@desc create a memory
//@route  POST /api/v1/memory
//@access private
exports.createMemory = asyncHandler(async (req, res, next) => {
  const memory = await Memory.create({
    ...req.body,
    user: req.user.id,
  });

  res.status(200).json({ success: true, data: memory });
});

//@desc update a  memory
//@route  PUT /api/v1/memory/:id
//@access private
exports.updateMemory = asyncHandler(async (req, res, next) => {
  let memory = await Memory.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate("user");

  if (!memory) {
    return next(
      new ErrorResponse(`Memory not found with the id ${req.params.id}`, 404)
    );
  }

  memory = await Memory.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    success: true,
    data: memory,
  });
});

//@desc delete a  memory
//@route  DELETE /api/v1/memory/:id
//@access private
exports.deleteMemory = asyncHandler(async (req, res, next) => {
  let event = await Memory.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate("user");

  if (!event) {
    return next(
      new ErrorResponse(`event not found with the id ${req.params.id}`, 404)
    );
  }

  await event.remove();

  res.status(200).json({
    success: true,
    data: "memory deleted",
  });
});
