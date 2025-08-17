import User from "../models/User.js";

export const updateCart = async (req, res) => {
    try {
        const { id, cartItems } = req.body;

        // Validate request
        if (!id || !cartItems) {
            return res.status(400).json({
                success: false,
                message: "Missing user ID or cart items"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { cartItems },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Cart updated",
            cartItems: updatedUser.cartItems
        });

    } catch (error) {
        console.error("Update Cart Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};
