import db from '../../../utils/db';
import { createObjectCsvWriter } from 'csv-writer';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const contacts = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM contact', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        const csvWriter = createObjectCsvWriter({
            path: 'contacts.csv',
            header: [
                { id: 'name', title: 'Name' },
                { id: 'email', title: 'Email' },
                { id: 'phone', title: 'Phone' },
                { id: 'address', title: 'Address' },
                { id: 'timezone', title: 'Timezone' },
                { id: 'createdAt', title: 'Created At' },
            ],
        });

        await csvWriter.writeRecords(contacts);

        res.download('contacts.csv', 'contacts.csv', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Could not download file');
            }
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
