const AWS = require('aws-sdk')
AWS.config.update({
    region: `${process.env.AWS_REGION}`,
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
    apiVersion: `${process.env.AWS_API_VERSION}`
})

const sqs = new AWS.SQS()

const producer = message => {
    return sqs.sendMessage({
        MessageBody: JSON.stringify(message),
        QueueUrl: `${process.env.AWS_QUEUE_URL}`
    }).promise()
}

const consumer = async () => {
    while (true){
        try {
            await delay(3000)
            const data = await receiveMessages()
            await data.Messages.forEach(message => handleMessage(message))
        } catch (err) {}
    }
}

const handleMessage = async message => {
    console.log(message.Body)
    await deleteMessage(message)
}

const receiveMessages = (params = {}) => {
    return sqs.receiveMessage({
        QueueUrl: `${process.env.AWS_QUEUE_URL}`,
        MaxNumberOfMessages: params.MaxNumberOfMessages || 1,
    }).promise()
}

const deleteMessage = message => {
    return sqs.deleteMessage({
        QueueUrl: `${process.env.AWS_QUEUE_URL}`,
        ReceiptHandle: message.ReceiptHandle
    }).promise()
}

const delay = time => new Promise(resolve => setTimeout(resolve, time))

module.exports = {producer, consumer}
