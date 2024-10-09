import { Router } from 'express';
const router = Router();
const user = require("./../controller/user.controller")
const auth = require("./../controller/auth.controller")


router
    .route("/signup")
    .post(user.signup)
router
    .route("/login")
    .post(user.login)
router
    .route("/token")
    .get(auth.token)

module.exports = router