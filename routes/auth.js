const authRouter = require("express").Router();
const User = require("../models/user");
const {registerValidation, loginValidation} = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

authRouter.post("/register", async (req,res)=>{

    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    //check if email is already registeret
    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) {
        return res.status(400).json({ error: "Email already exists" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //create user o bject and save it in Mongo (via try-catch)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password
    });

    try {
        const savedUser = await user.save(); //save user
        res.json({ error: null, data: savedUser._id });
    } catch (error) {
        res.status(400).json({ error });
    }

});


// LOGIN VALIDATION
authRouter.post("/login", async (req,res)=>{

    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).json({ error: "Email existnt" });
    }

    const  validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
            return res.status(400).json({ error: "password existnt" });
        }
    const token = jwt.sign(
        {
            name: user.name,
            id: user._id
        },
        process.env.TOKEN_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN},
    );

        res.header("auth-token",token).json({
            error:null,
            data: {token}
        })
});

module.exports = authRouter;