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
            res.status(401).json({ error: 'Token not provided' });
        }

        const { email } = jwt.verify(token, "gg") as { email: string };

        const user = await users.findOne({ email }, { username: 1, email: 1 });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }

        if (req.method === 'GET' && req.path === '/token') {
            res.status(200).json({ userId: user._id, email: user.email, username: user.username });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid or expired' });
    }
};