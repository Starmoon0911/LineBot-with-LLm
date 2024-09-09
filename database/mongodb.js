const mongoose = require('mongoose')

const createConnection = async ({ url = 'mongodb://0.0.0.0:27017' }) => {
    try {
     const DBclient = mongoose
            .connect(url)
            .then(() => {
                console.log("Success to Connect to MongoDB");
            })
            .catch((e) => {
                console.log('Connected to MongoDB')
                console.log(e);
            });
        return DBclient;
    } catch (e) {
        console.error(e)
        return;
    }
}

module.exports = createConnection;