import Address from "../models/Address.js";

// Add address
export const address = async (req, res) => {
    try {
        const {
            userId,
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            pinCode,
            country,
            phoneNumber,
            isDefault
        } = req.body;



        if (!userId || !firstName || !lastName || !email || !street || !city || !state || !pinCode || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        await Address.create({
            userId,
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            pinCode,
            country,
            phoneNumber,
            isDefault
        });

        res.json({
            success: true,
            message: "Address added Successfully"
        });

    } catch (error) {
        console.log("Error while saving address:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get addresses - Modified to accept userId from query params, headers, or the authenticated user
export const getAddress = async (req, res) => {
    try {
        // Try to get userId from multiple possible sources
        let userId;
        
        // Option 1: Try to get from query parameters
        if (req.query.userId) {
            userId = req.query.userId;
        } 
        // Option 2: Try to get from request body
        else if (req.body && req.body.userId) {
            userId = req.body.userId;
        }
        // Option 3: Try to get from request headers
        else if (req.headers.userid) {
            userId = req.headers.userid;
        }
        // Option 4: Try to get from authenticated user (if you have auth middleware)
        else if (req.user && req.user._id) {
            userId = req.user._id;
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const addresses = await Address.find({ userId });

        res.json({
            success: true,
            addresses
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};