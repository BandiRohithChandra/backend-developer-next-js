import { loginUser } from '../../../utils/auth';
import { loginSchema } from '../../../utils/validation';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { username, password } = await loginSchema.validateAsync(req.body);
            const token = await loginUser(username, password);
            res.status(200).json({ token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
