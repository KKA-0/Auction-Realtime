import { Request, Response } from 'express';
import { Error } from 'mongoose';
const products = require("./../schema/product.schema") 


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
        res.status(201).json(newProduct)
    }catch(err){
        res.status(400).json({ error: err || 'An error occurred while creating the Product.' });
    }
}

export const newbid = async (req: Request, res: Response) => {
    const { productId } = req.params
    const { newBid } = req.body;
    try{
        const product = await products.findById(productId);

        if (!product) {
            return { success: false, message: 'Product not found' };
        }

        product.Bidders.push(newBid);
        product.Price += 5;
        await product.save();
        
        res.status(201).json({ success: true, message: 'Bid added successfully', product })
    }catch(err){
        res.status(400).json({ error: err || 'An error occurred while Add the Bid.' });
    }
}

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