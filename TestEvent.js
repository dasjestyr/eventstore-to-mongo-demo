const mongoose = require('mongoose')
const Schema = mongoose.Schema

// index operations are safe. They will not attempt to rebuild existing indexes
// likewise, it will not rebuild an existing index with new options

const TestDataSchema = new Schema({
    clientId: {type: String, index: true}, // field level index definition
    a: Number,
    b: String
});

// these are fieldName: <collation>
TestDataSchema.index({clientId: 1, a: 1}) // schema level index definition (use for compounds)

module.exports = mongoose.model('TestEvent', TestDataSchema)