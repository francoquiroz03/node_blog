const express = require("express");
const router = express.Router();

const { create, postById, read, update, remove, list, listCategories, photo, } = require("../controllers/post");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/post/:postId", read);
router.get("/posts", list);
router.get("/posts/categories", listCategories);
router.get("/post/photo/:postId", photo);
router.post("/post/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put("/post/:postId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/post/:postId/:userId", requireSignin, isAuth, isAdmin, remove);

router.param("postId", postById);
router.param("userId", userById);

module.exports = router;