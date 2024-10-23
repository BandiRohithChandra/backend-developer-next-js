import db from '../../../utils/db';

export default async function handler(req, res) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        db.run('UPDATE user SET isVerified = 1 WHERE email = ?', [decoded.email], (error) => {
            if (error) return res.status(400).json({ error: 'Could not verify email' });
            res.status(200).json({ message: 'Email verified successfully' });
        });
    });
}
