import { Request, Response } from 'express';
const users  = require('./../schema/user.schema');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

interface userData {
    username: string,
    email: string
}

// Hashes a password using bcrypt
const HASH = async (pass: string) => {
    const hashedpass = await bcrypt.hash(pass, 8);
    return hashedpass;
}

// Verifies provided password with a hashed one
const CheckHASH = async (hashed: string, providePass: string) => {
    const check = await bcrypt.compare(providePass, hashed);
    return check;
}

// Generates a JWT token for the user
const generateToken = (userData: userData) => jwt.sign(userData, "gg");

export const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    try {
        const hashed = await HASH(password)
        const newUser = await users.create({
            username, email, password: hashed
        });
        const token = await generateToken({ username, email })
        res.status(201).json({ userId: newUser._id, username, email, token });
    } catch (err) {
        res.status(400).json({ error: err || 'An error occurred while creating the user.' });
    }
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const verify = await CheckHASH(user.password, password);
        if (!verify) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = generateToken({ username: user.username, email });
        return res.status(200).json({ userId: user._id, username: user.username, email, token });
        
    } catch (error) {
        return res.status(500).json({ error: error || 'An error occurred during login' });
    }
};
