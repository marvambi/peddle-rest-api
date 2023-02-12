import mongoose, { ConnectOptions } from 'mongoose';

import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectOptions = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5
    socketTimeoutMS: 45000, // Close sockets after 45 seconds inactivity
    family: 4,
  };

  // eslint-disable-next-line max-len
  // await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, options);
  // eslint-disable-next-line max-len
  await mongoose.connect(`mongodb+srv://marvambi:XPresent01A@dotsafety.uwefs.mongodb.net/peddle?retryWrites=true&w=majority`, options);
};

export { connectToDatabase };
