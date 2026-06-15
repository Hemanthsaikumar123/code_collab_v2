const authService = require("../services/authService");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const result = await authService.registerUser({
                username,
                email,
                password
            });

        return res.status(201).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};


const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        const result = await authService.loginUser({
                email,
                password
            });

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message
        });

    }

};


const getMe = async ( req, res ) => {

    try {

        const user = await authService.getCurrentUser(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};


module.exports = {
    register,
    login,
    getMe
};