const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TestDataSchema = new Schema({
    clientId: String,
    a: Number,
    b: String
});

module.exports = mongoose.model('TestEvent', TestDataSchema)