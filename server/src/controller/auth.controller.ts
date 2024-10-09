import { Request, Response, NextFunction } from 'express';
const users  = require('./../schema/user.schema');
var jwt = require('jsonwebtoken');

export const token = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;
        const token = authorization?.startsWith('Bearer')
            ? authorization.split(' ')[1]
            : req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({ error: 'Token not provided' });
        }

        const { email } = jwt.verify(token, "gg");

        const user = await users.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid or expired' });
    }
};
