import cloudinary from "../lib/cloudinary.js";
import generateToken from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
    const { fullname, password, email } = req.body;

    try {
        if (!(fullname && password && email)) {
            return res.status(400).json({
                message: "All fileds are mandatory"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast of 6 characters"
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "Email already exists, please login !"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

        } else {
            return res.status(400).json({
                message: "Invalid User data"
            })
        }
    } catch (error) {
        console.log("Error in signup process", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    };
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!(email && password)) {
            return res.status(400).json({
                message: "All fields are mandatory"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const comparedPassword = await bcrypt.compare(password, user.password)

        if (comparedPassword === false) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            message: "Login successful"
        })
    } catch (error) {
        console.log("Error in login process", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    };
};

const logout = (req, res) => {
    try {
        res.clearCookie("jwt", { maxAge: 0 });
        return res.status(200).json({
            message: "Logout successful"
        })
    } catch (error) {
        console.log("Error in logout process", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    };
};


const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const user = await User.findById(req.user._id);
        if (!profilePic) {
            return res.status(400).json({
                message: "profile pic is required"
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(user, {
            $push: {
                profilePic: {
                    $each: [{ url: uploadResponse.secure_url }],
                    $position: 0
                },
            },
            $slice: 5,
        }, {
            new: true
        })

        if (!updatedUser) {
            return res.status(400).json({
                message: "Unable to update profile pic"
            })
        }

        res.status(200).json({
            _id: updatedUser._id,
            fullname: updatedUser.fullname,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
        })
    } catch (error) {
        console.log("Error in update profile process", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

const checkAuth = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
        })
    } catch (error) {
        console.log("Error in check auth process", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    };
}

export { signup, login, logout, updateProfile, checkAuth };