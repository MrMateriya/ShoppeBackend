import mongoose, {Schema} from "mongoose";

const TokenSchema = new mongoose.Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    resetPasswordToken: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
)
const ResetPasswordTokenModel = mongoose.model('resetPasswordToken', TokenSchema);


export {ResetPasswordTokenModel}