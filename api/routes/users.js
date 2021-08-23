const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/User");

// update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (e) {
                res.status(404).json(e);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("user updated");
        } catch (e) {
            res.status(500).json(e);
        }
    }
});

// delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("delete");
        } catch (e) {
            res.status(200).json(e);
        }
    } else {
        return res.status(500).json("you can only delete your own id");
    }
});

// get user
router.get("/:id", async (req, res) => {
    try {
        const getUser = await User.findById(req.params.id);
        const { password, updatedAt, ...others } = getUser._doc;
        res.status(200).json(others);
    } catch (e) {
        res.status(500).json(e);
    }
});

// follow user
router.put("/:id/follow", async (req, res) => {
    if (req.params.id !== req.body.userId) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId); // me
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({
                    $push: { followings: req.params.id },
                });
                res.status(200).json("follow success");
            } else {
                res.status(404).json("you already followed");
            }
        } catch (e) {
            res.status(500).json(e);
        }
    } else {
        return res.status(500).json("you cannot follow yourself");
    }
});

// unfollow user
router.put("/:id/unfollow", async (req, res) => {
    if (req.params.id !== req.body.userId) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({
                    $pull: { followings: req.params.id },
                });
                res.status(200).json("unfollowed success");
            } else {
                res.status(404).json("you already unfollowed");
            }
        } catch (e) {
            res.status(500).json(e);
        }
    } else {
        return "you cannot unfollow yourself";
    }
});

module.exports = router;
