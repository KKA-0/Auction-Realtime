import mongoose from 'mongoose';
const { Schema } = mongoose;

const BidSchema = new Schema({
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

const productSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  Bidders: [BidSchema]

});

const products = mongoose.model('Products', productSchema);
module.exports = products