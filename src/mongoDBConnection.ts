import mongoose, { ConnectOptions } from 'mongoose';

import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectOptions = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4,
  };

  // eslint-disable-next-line max-len
  await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, options);
};

export { connectToDatabase };
