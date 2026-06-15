const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const userModel = require("../models/userModel");
const { generateToken } = require("../utils/jwt");

const registerUser = async ({ username, email, password }) => {

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
        id: uuidv4(),
        username,
        email,
        passwordHash
    });

    const token = generateToken(user.id);

    return {
        user,
        token
    };
};


const loginUser = async ({ email, password }) => {

    const user = await userModel.findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        },
        token
    };
};

module.exports = {
    registerUser,
    loginUser
};