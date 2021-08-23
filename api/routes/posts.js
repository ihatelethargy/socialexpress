const router = require("express").Router();
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
const User = require("../models/User");

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

// delete post

// like&dislike post

// getTimeline

module.exports = router;
