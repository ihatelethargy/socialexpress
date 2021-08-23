const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// new register
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //create user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json(e);
    }
});

// login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("there is no user");

        const vaildPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        !vaildPassword && res.status(404).json("wrong password");

        res.status(200).json(user);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;
