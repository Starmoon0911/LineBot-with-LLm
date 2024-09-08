const { MongoClient } = require('mongodb')
const createConnection = async ({ url = 'mongodb://0.0.0.0:27017' }) => {
    const client = new MongoClient(url)
    try {
        client.connect();
        console.log('Connected to MongoDB')
        return client;
    } catch(e) {
        console.error(e)
        return;
    }
}

module.exports = createConnection;