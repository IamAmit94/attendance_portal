const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateAuthToken, validateUser } = require("../commonFunction/commonFunx");


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.methods.generateAuthToken = generateAuthToken;

const validate = validateUser;


const User = mongoose.model("user", userSchema);
module.exports = { User, validate };
