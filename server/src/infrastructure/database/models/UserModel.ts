import mongoose, { Schema, Document } from "mongoose";
import { User } from "../../../domain/entities/User";

export interface UserDocument extends User, Document {
  id: string;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
