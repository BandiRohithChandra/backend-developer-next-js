const db = new Database(':memory:', (err) => {
    if (err) {
        console.error('Error opening database: ' + err.message);
    } else {
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT UNIQUE,
            isVerified INTEGER DEFAULT 0 -- Add email verification status
        )`);

        db.run(`CREATE TABLE contact (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            name TEXT,
            email TEXT UNIQUE,
            phone TEXT,
            address TEXT,
            timezone TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            deletedAt DATETIME, -- New field for soft delete
            FOREIGN KEY(userId) REFERENCES user(id)
        )`);
    }
});
