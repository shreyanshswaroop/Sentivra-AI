import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema =
  mongoose.models.User?.schema ??
  new Schema<IUser>(
    {
      name: { type: String, required: true },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: { type: String, required: true },
    },
    { timestamps: true }
  );

export const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  deviceInfo?: string;
  lastActive: Date;
}

const SessionSchema =
  mongoose.models.Session?.schema ??
  new Schema<ISession>(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      token: { type: String, required: true, unique: true },
      expiresAt: { type: Date, required: true },
      deviceInfo: { type: String },
      lastActive: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session =
  (mongoose.models.Session as mongoose.Model<ISession>) ||
  mongoose.model<ISession>("Session", SessionSchema);
