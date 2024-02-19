const jwt = require("jsonwebtoken");
const Joi = require("joi");

const generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, name: this.name },
        process.env.JWTPRIVATEKEY
    );
    return token;
};

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

const validateData = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().optional(),
        name: Joi.string().optional(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = { generateAuthToken, validateUser, validateData };
