import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs';

async function handler(req, res) {
    //Only POST mothod is accepted
    if (req.method === 'POST') {
        //Getting username and password from body
        const { username, password } = req.body;
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
            
            const checkPassword = await compare(password, checkExisting.password);
            if(checkPassword){
                res.status(200).json({ message: 'Success.'})
            }else{
                res.status(422).json({ message: 'Password is wrong.'})
            }
            client.close();
        }
        else{
            res.status(421).json({ message: 'Username is wrong.'})
            client.close();
        }
        
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Route not valid' });
    }
}

export default handler;