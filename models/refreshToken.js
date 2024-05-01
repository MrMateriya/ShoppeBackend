import mongoose, {Schema} from "mongoose";

const TokenSchema = new mongoose.Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
)
const RefreshTokenModel = mongoose.model('refreshToken', TokenSchema);


export {RefreshTokenModel}