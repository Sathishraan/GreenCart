import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT);

        let user;

        if (tokenDecode.id) {
            user = await UserModel.findById(tokenDecode.id).select("name email");
            if (!user) {
                return res.json({ success: false, message: 'User not found' });
            }
            req.user = user;
        } else {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
