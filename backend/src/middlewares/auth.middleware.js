import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log('Received token:', token);

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.userId).select("-password");
        // console.log('Found user:', user);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized - User not found"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in auth middleware", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    };
}

export default protectRoute;