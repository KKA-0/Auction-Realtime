import mongoose from 'mongoose';
const { Schema } = mongoose;

const BidSchema = new Schema({
    userId: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    createdAt: new Date()
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
  createdAt: new Date(),
  Bidders: [BidSchema]

});

const products = mongoose.model('Prodcuts', productSchema);
module.exports = products