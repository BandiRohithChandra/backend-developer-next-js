import db from '../../../utils/db';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        db.get('SELECT * FROM contact WHERE id = ?', [id], (err, contact) => {
            if (err) return res.status(400).json({ error: 'Contact not found' });
            res.status(200).json(contact);
        });
    } else if (req.method === 'DELETE') {
        db.run('DELETE FROM contact WHERE id = ?', [id], (err) => {
            if (err) return res.status(400).json({ error: 'Could not delete contact' });
            res.status(204).end();
        });
    } else {
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
