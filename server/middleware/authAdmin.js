import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    // Change adminToken to admintoken to match your login function
    const { admintoken } = req.cookies;

    if (!admintoken) {
        return res.json({
            success: false, 
            message: 'Not Authorized'
        });
    }



    try {
        const tokenDecode = jwt.verify(admintoken, process.env.JWT);

        if (tokenDecode.email === process.env.ADMIN_EMAIL) {
            // Only call next() once when authorized
            return next();
        } else {
            return res.json({
                success: false, 
                message: 'Not Authorized'
            });
        }
    } catch (error) {
        return res.json({
            success: false, 
            message: error.message
        });
    }
};

export default authAdmin;