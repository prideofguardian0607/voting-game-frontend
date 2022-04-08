import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';
async function handler(req, res) {
    //Only POST mothod is accepted
    if (req.method === 'POST') {
        //Getting username and password from body
        const { metausername, username, password, email } = req.body;
        //Validate
        // if (!username || !username.includes('@') || !password) {
        //     res.status(422).json({ message: 'Invalid Data' });
        //     return;
        // }
        //Connect with database
        const client = await MongoClient.connect(
            'mongodb+srv://Xpoesy-Test:xpoesy@cluster0.olahs.mongodb.net/voting?retryWrites=true&w=majority',
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        const db = client.db();
        //Check existing
        const checkExisting = await db
            .collection('users')
            .findOne({ username: username });
        //Send error response if duplicate user is found
        if (checkExisting) {
            res.status(422).json({ message: 'User already exists' });
            client.close();
            return;
        }
        //Hash password
        const status = await db.collection('users').insertOne({
            metausername,
            username,
            password: await hash(password, 12),
            email,

        });
        //Send success response
        res.status(201).json({ message: 'User created', ...status });
        //Close DB connection
        client.close();
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Route not valid' });
    }
}

export default handler;