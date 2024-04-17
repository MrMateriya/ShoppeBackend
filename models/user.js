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
    }
  },
  {
    timestamps: true,
  }
)
const UserSchemaModel = mongoose.model('User', UserSchema);


export {UserSchemaModel}