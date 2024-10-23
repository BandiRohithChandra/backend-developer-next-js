import { sendVerificationEmail } from '../../../utils/email';

export default async function handler(req, res) {
    const { email } = req.body;

    // Check if user exists
    db.get('SELECT * FROM user WHERE email = ?', [email], async (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await sendVerificationEmail(email, token);
        res.status(200).json({ message: 'Password reset email sent' });
    });
}
