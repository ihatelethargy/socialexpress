const router = require("express").Router();
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
const { findById } = require("../models/User");
const User = require("../models/User");
const { route } = require("./auth");

// create post
router.post("/", async (req, res) => {
    const newPost = await Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (e) {
        res.status(500).json(e);
    }
});

// update post

router.put("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (req.body.userId === post.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("updated your post");
        } else {
            return res.status(404).json("edit only your post");
        }
    } catch (e) {
        res.status(500).json(e);
    }
});

// delete post

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("deleted post");
        } else {
            res.status(404).json("you can edit only your post");
        }
    } catch (e) {
        res.status(500).json(e);
    }
});

// like&dislike post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("like post");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("dislike post");
        }
    } catch (e) {
        res.status(500).json(e);
    }
});

// getTimeline
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPost = await Post.find({ userId: currentUser._id });
        const friendPost = await Promise.all(
            currentUser.followers.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(userPost.concat(...friendPost));
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;
