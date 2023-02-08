import { Router } from 'express';
// eslint-disable-next-line max-len
import { createUser, deleteUser, getAllUsers, getUser, loginUser, logout, updateUser } from '../controllers/user.controller';

const userRoute = () => {
  const router = Router();

  router.post('/users', createUser);

  router.get('/users', getAllUsers);

  router.get('/users/:id', getUser);

  router.patch('/users/:id', updateUser);

  router.delete('/users/:id', deleteUser);

  router.post('/users/login', loginUser);

  router.post('/users/logout', logout);

  return router;
};

export { userRoute };
