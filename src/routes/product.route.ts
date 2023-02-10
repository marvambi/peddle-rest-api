import { Router } from 'express';
import protect from '../middleWare/auth.middleware';
// eslint-disable-next-line max-len
import getAProd, { createProduct, getProducts, deleteProduct, updateProduct } from '../controllers/product.controller';
import upload from '../utils/fileUpload';

const productRoute = () => {
  const router = Router();

  // eslint-disable-next-line max-len
  router.post('/product', upload.upload.single('image'), createProduct);
  // eslint-disable-next-line max-len
  router.patch('/product/:id', protect, upload.upload.single('image'), updateProduct);
  router.get('/product', protect, getProducts);
  router.get('/product/:id', protect, getAProd.getAProd);
  router.delete('/product/:id', protect, deleteProduct);
  return router;
};

export { productRoute };
