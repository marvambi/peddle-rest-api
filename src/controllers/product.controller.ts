import asyncHandler from 'express-async-handler';
import { Product } from '../models/product.model';
import fileSizeFormatter from '../utils/fileUpload';
import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import { rm } from 'fs';
// Create Prouct

cloudinary.config({
  cloud_name: 'marvambi',
  api_key: '814791677236547',
  api_secret: 'tCN9l1aaaQuVgl3a7bNzWPpdxHM',
  secure: true,
});
export const createProduct = asyncHandler(async (req: any, res: any) => {
  const { category, description, name, price, quantity, sku, user } = req.body;

  //   Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Handle Image upload
  let fileData = {};

  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Peddle Store',
        resource_type: 'image',
      });
      delete uploadedFile['api_key'];
      // log(uploadedFile);
    } catch (error) {
      res.status(500);
      throw new Error(`Error: ${error}`);
    }
    if (uploadedFile) {
      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter.fileSizeFormatter(req.file.size, 2),
      };
      rm(req.file.path, () => log);
    }
  }

  // Create Product
  const product = await Product.create({
    user,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

// Get all Products
export const getProducts = asyncHandler(async (req: any, res: any) => {
  const products = await Product.find({ user: req.user.id }).sort('-createdAt');

  res.status(200).json(products);
});

// Get single product
const getAProd = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  res.status(200).json(product);
});

// Delete Product
export const deleteProduct = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await product.remove();
  res.status(200).json({ message: 'Product deleted.' });
});

// Update Product
export const updateProduct = asyncHandler(async (req: any, res: any) => {
  const { category, description, name, price, quantity } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // Handle Image upload
  let fileData = {};

  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Pinvent App',
        resource_type: 'image',
      });
    } catch (error) {
      res.status(500);
      throw new Error('Image could not be uploaded');
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter.fileSizeFormatter(req.file.size, 2),
    };
  }

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json(updatedProduct);
});

export default {
  createProduct,
  getProducts,
  getAProd,
  deleteProduct,
  updateProduct,
};
