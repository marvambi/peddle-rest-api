import express from 'express';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import { connectToDatabase } from './mongoDBConnection';
import { roleRoute } from './routes/role.route';
import { userRoute } from './routes/user.route';
import path from "path";

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const app = express();
const corsOptions = {
  origin: ['http://localhost:8081', 'https://peddle-app.vercel.app'],
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// configure app.use middle-ware here to prevent route not found error
app.use('/', roleRoute());
app.use('/', userRoute());

app.get('/', (req, res) => {
  const checkSystem = (server: string, client: string) => {
    return `${server} & ${client} are great combinations 😇`;
  };

  const the_server = 'Node.js RESTful API';
  const the_client = 'React Storefront';
  const combination = checkSystem(the_server, the_client);

  return res.json({ message: `'Wow! 👉' ${combination}` });
});

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started @ URL ${HOST}:${PORT} 🎉`);
});
