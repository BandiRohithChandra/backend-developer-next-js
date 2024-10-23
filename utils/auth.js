import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db';

export const registerUser = async (username, password, email) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

export const loginUser = async (username, password) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM user WHERE username = ?', [username], async (err, user) => {
            if (err || !user) return reject('Invalid credentials');
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return reject('Invalid credentials');
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            resolve(token);
        });
    });
};
