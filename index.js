
import express from 'express';
import path from 'path';
import { MongoClient } from 'mongodb';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const dbName = 'Election_Survey';
const url = process.env.MONGODB_URI;

if (!url) {
    throw new Error('MONGODB_URI environment variable is missing');
}

const client = new MongoClient(url);

const db = client.db(dbName);
const collection = db.collection('survey_output');

// Show the form
app.get('/', (req, resp) => {
    const absPath = path.resolve('index.html');
    resp.sendFile(absPath);
});

// Save form data
app.post('/submit', async (req, resp) => {
    try {
        await collection.insertOne(req.body);

        const absPath = path.resolve('submit.html');
        resp.sendFile(absPath);
    } catch (error) {
        console.error('Error saving survey:', error);
        resp.status(500).send('Something went wrong while saving your response.');
    }
});

// Connect to MongoDB before starting the server
try {
    await client.connect();
    console.log('Connected to MongoDB');

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
} catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
}
