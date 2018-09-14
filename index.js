const esClient = require('node-eventstore-client')
const mongoose = require('mongoose')
const TestEvent = require('./TestEvent')

mongoose.connect('mongodb://localhost/esTest')
mongoose.connection.once('open', () => {
    console.log('connected to mongo!')
})

let id = 'abc'
const eventAppeared = async (stream, event) => {
    if(!event.originalEvent.eventType.startsWith('$')) {
        console.log(`Received: ${event.originalEvent.eventType} : ${event.originalEvent.data}`)
        let e = JSON.parse(event.originalEvent.data)
        var data1 = {
            clientId: id,
            a: e.a,
            b: e.b
        }

        let query = {clientId: id}
        
        await TestEvent.updateOne(query, data1, {upsert: true})
        
        // testing that the upsert doesn't cause an _id collision
        var data2 = {
            clientId: id,
            a: e.a,
            b: e.b
        }
        await TestEvent.updateOne(query, data2, {upsert: true})
    }    
}

// start the subscription
let connSettings = {}
let creds = new esClient.UserCredentials("admin", "changeit")
let esConnection = esClient.createConnection(connSettings, 'tcp://localhost:1113')
esConnection.connect();
esConnection.once('connected', (endpoint) => {
    console.info(`Connected to ES at ${endpoint.host}:${endpoint.port}`)
    esConnection.subscribeToAllFrom(
        null, true, eventAppeared,
        () => console.log("Catchup complete. Monitoring for new events!"),
        (sub, reason, err) => console.log(`Subscription dropped: ${err}`),
         creds)        
});

