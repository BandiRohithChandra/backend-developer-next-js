import db from '../../../utils/db';
import { contactSchema } from '../../../utils/validation';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, email, phone, address, timezone } = await contactSchema.validateAsync(req.body);
            const userId = req.user.id; // Assuming user ID is set in request
            db.run('INSERT INTO contact (userId, name, email, phone, address, timezone) VALUES (?, ?, ?, ?, ?, ?)', 
                [userId, name, email, phone, address, timezone], (err) => {
                    if (err) return res.status(400).json({ error: 'Contact already exists' });
                    res.status(201).json({ message: 'Contact added successfully' });
                }
            );
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
