import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Register  /api/user/register

export const register = async (req, res) => {

    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "missing details"
            })

        }

        const existing = await User.findOne({ email })

        if (existing) {
            return res.json({
                success: false,
                message: "Already exist email"
            })

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword })

        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'

        })

        return res.json({
            success: true,
            user: { user: user.name, email: user.email }
        })



    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }

}

//login    /api/user/register

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.json({
                success: false,
                message: "Enter the email and Password"
            })

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.json({
                success: false,
                message: "Invalid email and Password"
            })

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.json({
                success: false,
                message: "Invalid email and Password"
            })

        }
        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });


        return res.json({
            success: true,
            user: { user: user.name, email: user.email }
        })

    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }

}

//auth

export const isAuth = async (req, res) => {

    try {


        return res.json({
            success: true,
            user: req.user
        });

    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })
    }

}

export const logout = async (req, res) => {

    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
            path: '/'
        });

        return res.json({
            success: true,
            message: 'Logged out successfully',
        })

    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }

}
