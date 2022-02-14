/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_PATREONSNOWFLAKES_ARN
	STORAGE_PATREONSNOWFLAKES_NAME
	STORAGE_USERPATREONTOKENS_ARN
	STORAGE_USERPATREONTOKENS_NAME
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')

let snowflakeTableName = "patreonsnowflakes";
if (process.env.ENV && process.env.ENV !== "NONE") {
    snowflakeTableName = snowflakeTableName + '-' + process.env.ENV;
}

let tokenTableName = "userpatreontokens";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tokenTableName = tokenTableName + '-' + process.env.ENV;
}

exports.handler = async (event, context, callback) => {

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const patreonSnowflake = event.request.clientMetadata.patreonSnowflake

    const { Item: tokenData } = await dynamodb.get({
        TableName: snowflakeTableName,
        Key: {
            'snowflake': patreonSnowflake
        }
    }).promise()

    
    if (!tokenData) {
        console.error(`Could not find token data for snowflake ${patreonSnowflake}`)
        return callback(new Error(`Could not find token data for snowflake ${patreonSnowflake}`), event)
    }

    const userId = event.request.userAttributes.sub

    let putItemParams = {
        TableName: tokenTableName,
        Item: {
            user_id: userId,
            access_token: tokenData.access_token,
            expire_timestamp: tokenData.expire_timestamp,
            refresh_token: tokenData.refresh_token
        }
    }

    dynamodb.put(putItemParams, (err, data) => {
        if (err) throw err
        else console.log(`Added patreon token for user with ID ${userId}`)
    })

    dynamodb.delete({
        TableName: snowflakeTableName,
        Key: {
            'snowflake': patreonSnowflake
        }
    });

    callback(null, event)

};
