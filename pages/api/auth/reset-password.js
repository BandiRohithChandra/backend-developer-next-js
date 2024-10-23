import db from '../../../utils/db';

export default async function handler(req, res) {
    const { token, newPassword } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, decoded.email], (error) => {
            if (error) return res.status(400).json({ error: 'Could not update password' });
            res.status(200).json({ message: 'Password updated successfully' });
        });
    });
}
