import { registerUser } from '../../../utils/auth';
import { registerSchema } from '../../../utils/validation';
import { sendVerificationEmail } from '../../../utils/email';
import jwt from 'jsonwebtoken'; // Make sure to import jwt

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { username, password, email } = await registerSchema.validateAsync(req.body);
            await registerUser(username, password, email);
            
            // Create a verification token
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            // Send the verification email
            await sendVerificationEmail(email, token);
            
            res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
