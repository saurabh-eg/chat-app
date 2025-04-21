import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "minimum length should not be less than 6"],
    },
    profilePic: {
        type: [{
          url: { 
            type: String,
            required: true,
          },
        }],
        default: [] // Add this default value
      },
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);

export default User;