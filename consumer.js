(async () => {
    require('dotenv').config()
    const sqsClient = require('./sqs')
    await sqsClient.consumer()
})()
