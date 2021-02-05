const AWS = require('aws-sdk')

let tableName = "patreonsnowflakes";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}


exports.handler = async (event, context, callback) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient();

  event.response.autoConfirmUser = false

  const patreonSnowflake = event.request.clientMetadata.patreonSnowflake

  const { Item: tokenData } = await dynamodb.get({
    TableName: tableName,
    Key: {
      'snowflake': patreonSnowflake
    }
  }).promise()

  if (tokenData) {
    event.response.autoConfirmUser = true
  } else {
    callback(new Error('Invalid Patreon snowflake'), event)
  }

  // Return to Amazon Cognito
  callback(null, event)
}
