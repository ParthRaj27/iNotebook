const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook";
// https://mongoosejs.com/docs/guide.html
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connection successfully established!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToMongo;

