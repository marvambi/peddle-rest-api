import mongoose, { Schema, Model, Document } from 'mongoose';

type UserDocument = Document & {
  fullName: string;
  email: string;
  password: string;
  enabled: string;
  role: string;
  hash: string;
  salt: string;
};

type UserInput = {
  fullName: UserDocument['fullName'];
  email: UserDocument['email'];
  password: UserDocument['password'];
  enabled: UserDocument['enabled'];
  role: UserDocument['role'];
  salt: UserDocument['salt'];
};

const usersSchema = new Schema(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    enabled: {
      type: Schema.Types.Boolean,
      default: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true,
    },
    hash: {
      type: Schema.Types.String,
    },
    salt: {
      type: Schema.Types.String,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

// eslint-disable-next-line max-len
const User: Model<UserDocument> = mongoose.model<UserDocument>('User', usersSchema);

export { User, UserInput, UserDocument };
