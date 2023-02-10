import mongoose, { Model } from 'mongoose';

type ProductDocument = Document & {
  name: string;
  user: string;
  sku: string;
  category: string;
  price: string;
  quantity: string;
  description: string | null;
  image: object;
};

type ProductInput = {
  name: ProductDocument['name'];
  user: ProductDocument['user'];
  sku: ProductDocument['sku'];
  category: ProductDocument['category'];
  price: ProductDocument['price'];
  quantity: ProductDocument['quantity'];
  description: ProductDocument['description'];
  image: ProductDocument['image'];
};

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    sku: {
      type: mongoose.Schema.Types.String,
      required: true,
      default: 'SKU',
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    quantity: {
      type: mongoose.Schema.Types.String,
      required: [true, 'Please add a quantity'],
      trim: true,
    },
    price: {
      type: mongoose.Schema.Types.String,
      required: [true, 'Please add a price'],
      trim: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    image: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// eslint-disable-next-line max-len
const Product: Model<ProductDocument> = mongoose.model<ProductDocument>('Product', productSchema);

export { Product, ProductInput, ProductDocument };
