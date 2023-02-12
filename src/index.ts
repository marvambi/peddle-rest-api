import express from 'express';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import { connectToDatabase } from './mongoDBConnection';
import { roleRoute } from './routes/role.route';
import { userRoute } from './routes/user.route';
import { productRoute } from './routes/product.route';
import path from 'path';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '80');

const app = express();
const corsOptions = {
  // eslint-disable-next-line max-len
  allowed_origins: ['http://localhost:3000', 'https://main--darling-rolypoly-632b11.netlify.app'],
  credentials: true,
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// eslint-disable-next-line max-len
const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://main--darling-rolypoly-632b11.netlify.app'];

app.use((req, res, next) => {
  const { origin } = req.headers;
  // eslint-disable-next-line max-len
  const theOrigin = ALLOWED_ORIGINS.indexOf(`${origin}`) >= 0 ? origin : ALLOWED_ORIGINS[1];

  res.header('Access-Control-Allow-Origin', theOrigin);
  // eslint-disable-next-line max-len
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  next();
});
app.use(cors(corsOptions));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// configure app.use middle-ware here to prevent route not found error
app.use('/', roleRoute());
app.use('/', userRoute());
app.use('/', productRoute());

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
