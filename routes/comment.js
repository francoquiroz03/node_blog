const express = require("express");
const router = express.Router();

const { create, commentById, read, update, remove, list } = require("../controllers/comment");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { postById } = require("../controllers/post");

router.get("/comment/:commentId", read);
router.get("/comments", list);
router.post("/comment/create/:postId/:userId", requireSignin, create);
router.put("/comment/:commentId/:userId", requireSignin, update);
router.delete("/comment/:commentId/:userId", requireSignin, remove);

router.param("commentId", commentById);
router.param("userId", userById);
router.param("postId", postById);

module.exports = router;