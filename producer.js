(async () => {
    require('dotenv').config()
    const sqsClient = require('./sqs')

    await sqsClient.producer({
        orderId: 1,
        message: 'teste'
    })
})()
