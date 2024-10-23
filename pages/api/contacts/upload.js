import fs from 'fs';
import multer from 'multer';
import csvParser from 'csv-parser';
import db from '../../../utils/db';
import { contactSchema } from '../../../utils/validation';

const upload = multer({ dest: 'uploads/' }); // Temporary storage

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to handle file upload
    },
};

const uploadHandler = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) return res.status(500).json({ error: 'File upload failed' });

        const contacts = [];
        const results = [];

        // Read and parse CSV file
        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', async () => {
                for (const contact of results) {
                    try {
                        await contactSchema.validateAsync(contact); // Validate each contact
                        contacts.push(contact);
                    } catch (validationError) {
                        return res.status(400).json({ error: `Invalid contact data: ${validationError.message}` });
                    }
                }

                // Save contacts to the database
                const userId = req.user.id; // Assuming user ID is set in request
                const promises = contacts.map(contact => {
                    return new Promise((resolve, reject) => {
                        db.run('INSERT INTO contact (userId, name, email, phone, address, timezone) VALUES (?, ?, ?, ?, ?, ?)', 
                            [userId, contact.name, contact.email, contact.phone, contact.address, contact.timezone], (err) => {
                                if (err) return reject(err);
                                resolve();
                            });
                    });
                });

                try {
                    await Promise.all(promises);
                    res.status(201).json({ message: 'Contacts uploaded successfully' });
                } catch {
                    // Handle the error without the dbError variable
                    return res.status(500).json({ error: 'Failed to save contacts to database' });
                } finally {
                    // Cleanup: Delete the temporary file
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error('Failed to delete temporary file', err);
                    });
                }
            });
    });
};

export default uploadHandler;
