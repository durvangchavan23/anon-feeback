import mongoose, { model, models, Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  verifyCode: string | null;
  verifyCodeExpiry: Date | null;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userModel = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verifyCode: {
      type: String,
    },
    verifyCodeExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userModel.plugin(aggregatePaginate)

export const User = models?.User || model<IUser>("User", userModel);
