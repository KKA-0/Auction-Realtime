const mongoose = require('mongoose');
const products = require('./../schema/product.schema');

interface Product {
    _id: string,
    lastBidAt: Date
}

export const auctionTimers = new Map();


export async function startproductsTimer() {
    setInterval(async () => {
        const currentTime = new Date();

        for (const [key, value] of auctionTimers.entries()) {
            const dateValue = new Date(value);
            const valuePlus30Secs = new Date(dateValue.getTime() + 30 * 1000);

            if (valuePlus30Secs < currentTime) {
                console.log(key)
                try {
                    await products.findOneAndUpdate(
                        { _id: key }, 
                        { sold: true }, // Set sold to true
                        { new: true }
                    );
                    auctionTimers.delete(key);
                } catch (error) {
                    console.error(`Failed to update product with ID ${key}:`, error);
                }
            }
        }
    }, 1000);
}


export async function initializeproductsTimers() {
    const activeAuctions = await products.find({ sold: false });

    activeAuctions.forEach((auction: Product) => {
        auctionTimers.set(auction._id, auction.lastBidAt);
    });
    // console.log(auctionTimers)
    startproductsTimer()
}

