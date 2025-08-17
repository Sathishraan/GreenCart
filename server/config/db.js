
import mongoose from "mongoose";

const connectDB = async () => {
    try {

        mongoose.connection.on('connected', () => {
            console.log("MongoDB connected");
        });

        await mongoose.connect(process.env.MONGODB_URL);

    } catch (error) {
        console.log(" MongoDB connection error:", error.message);
    }
};

export default connectDB;
