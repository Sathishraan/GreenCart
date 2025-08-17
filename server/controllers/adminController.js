import jwt from 'jsonwebtoken';

// Admin Login

export const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;


        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign({ email }, process.env.JWT, { expiresIn: '7d' })

            res.cookie('admintoken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,

            })

            return res.json({
                success: true,
                message: "Login Success"
            })

        }
        else {

            return res.json({
                success: false,
                message: "Invalid Email or Password"
            })

        }


    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }


}



//auth

export const isAdminAuth = async (req, res) => {
 
    try {


        return res.json({
            success: true,
            user: req.user
        })

    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })
    }

}

export const adminlogout = async (req, res) => {

    try {

        res.clearCookie('admintoken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

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
