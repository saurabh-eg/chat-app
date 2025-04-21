import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoDB = await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongoDB connected successfully ${mongoDB.connection.host}`)
    } catch (error) {
        console.log(`mongoDB connection error ${error.message}`)
    }
};

export default connectDB;