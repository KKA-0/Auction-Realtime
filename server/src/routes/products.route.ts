import { Router } from 'express';
const router = Router();
const product = require("./../controller/products.controller")
const auth = require("./../controller/auth.controller")

router
    .route("/")
    .get(auth.token, product.Product)
    .post(auth.token, product.newProduct)
router
    .route("/bid/:productId")
    .get(auth.token, product.winner)
    .patch(auth.token, product.newbid)

module.exports = router