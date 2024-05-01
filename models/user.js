import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    login: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      required: false
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    emailActivationLink: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
)
const UserModel = mongoose.model('User', UserSchema);


export {UserModel}