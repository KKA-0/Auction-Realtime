import { Request, Response } from 'express';
import { Error } from 'mongoose';
const products = require("./../schema/product.schema") 
import { auctionTimers } from "./../Realtime/sold"

export const Product = async (req: Request, res: Response) => {
    try{
        const Products = await products.find()
        res.status(200).json(Products)
    }catch(err){
        res.status(400).json({ error: err || 'An error occurred while fetching products.' });
    }
}

export const newProduct = async (req: Request, res: Response) => {
    try{
        const newProduct = await products.create(req.body)
        auctionTimers.set(newProduct._id, newProduct.lastBidAt)
        res.status(201).json(newProduct)
    }catch(err){
        res.status(400).json({ error: err || 'An error occurred while creating the Product.' });
    }
}

export const newbid = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { newBid } = req.body;

    try {
        const product = await products.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const lastBidAt = product.lastBidAt || product.createdAt;

        const currentTime = new Date();
        const lastBidDeadline = new Date(lastBidAt);
        lastBidDeadline.setSeconds(lastBidDeadline.getSeconds() + 30);

        if (currentTime > lastBidDeadline) {
            return res.status(400).json({ success: false, message: 'Bidding time has ended for this product' });
        }

        product.Bidders.push(newBid);
        product.Price += 5;
        product.lastBidAt = currentTime;
        await product.save();
        auctionTimers.set(product._id, product.currentTime)

        res.status(201).json({ success: true, message: 'Bid added successfully', product });
    } catch (err) {
        res.status(400).json({ error: err || 'An error occurred while adding the bid.' });
    }
};


export const winner = async (req: Request, res: Response) => {

    const { productId } = req.params;
    try {
        const product = await products.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const { Bidders: bidders } = product;

        if (!bidders || bidders.length === 0) {
            return res.status(200).json({ success: true, message: 'No bids found' });
        }

        const lastBid = bidders[bidders.length - 1];

        console.log(lastBid);

        return res.status(200).json({ success: true, lastBid });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'An error occurred while processing the bid.', error: err });
    }
};