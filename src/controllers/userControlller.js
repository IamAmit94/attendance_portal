const { User, validate } = require("../models/user");
const {validateData} = require('../commonFunction/commonFunx');
const auth = require("../../middlewares/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// user Registration
const userSignup = async (req, res) => {
    try {
        // Validate request body
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check if user with the same name or email already exists
        const existingUser = await User.findOne({
            $or: [
                { name: req.body.name },
                { email: req.body.email }
            ]
        });

        if (existingUser) {
            return res.status(400).send('User with the same name or email already exists');
        }

        // Create a new user
        const user = new User(req.body);

        // Hash the password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        user.password = await bcrypt.hash(user.password, salt);

        // Save the user to the database
        await user.save();

        res.send({msg: 'User created successfully', user});
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
};


// Fetch the user details  // Auth
const userAll =  async (req, res) => {
    try {
        // const user = await User.findById(req.user._id).select("-password -__v");
        const user = await User.find({}, { name: 1, _id: 1 });
        res.send({msg: 'All user list ', user});
    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }
}

// user login 
const userLogin = async (req, res) => {
    try {
        const { error } = validateData(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // find the user by email or name
        const user = await User.findOne({
            $or: [
                { email: req.body.email },
                { name: req.body.name }
            ]
        });

        // If no user is found, return an error
        if (!user) return res.status(400).send("Invalid email or password");

        // Check the password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        // If the password is not valid, return an error
        if (!validPassword) return res.status(400).send("Invalid email or password");

        // Generate and send the authentication token
        const token = user.generateAuthToken();
        res.send({ msg: "User logged in successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
};



module.exports = {userSignup, userAll, userLogin};
