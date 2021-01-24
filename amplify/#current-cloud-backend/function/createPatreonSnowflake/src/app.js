/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const { URL, URLSearchParams } = require('url');
const uuid = require('uuid')
const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express');
const fetch = require('node-fetch');


AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const secretsManager = new AWS.SecretsManager();

let tableName = "patreonsnowflakes";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

app.post("/patreon-snowflake", async function(req, res) {
  const secret = await secretsManager.getSecretValue({ SecretId: 'compcon-' + process.env.ENV }).promise()
  if (!secret) {
    throw new Error('Secret not found')
  }
  const { PATREON_CLIENT_ID, PATREON_CLIENT_SECRET, PATREON_REDIRECT_URI } = JSON.parse(secret.SecretString)
  const oauthGrantCode = req.body.auth_code
  let tokensResponse;
  const patreonUrl = new URL('https://www.patreon.com/api/oauth2/token')
  const params = {
    grant_type: 'authorization_code',
    code: oauthGrantCode,
    client_id: PATREON_CLIENT_ID,
    client_secret: PATREON_CLIENT_SECRET,
    redirect_uri: PATREON_REDIRECT_URI
  }
  patreonUrl.search = new URLSearchParams(params).toString()
  try {
    tokensResponse = await fetch(patreonUrl, { method: 'POST' })
  } catch (err) {
    res.statusCode = 500;
    res.json({message: 'error getting code grant at ' + patreonUrl.toString(), error: err, url: req.url, body: req.body});
    return;
  }
  const tokensData = await tokensResponse.json();

  if (tokensData.error) {
    res.statusCode = 500;
    res.json({ message: tokensData.error })
  }

  const userInfoResponse = await fetch('https://www.patreon.com/api/oauth2/v2/identity?include=memberships,memberships.campaign&fields%5Bmember%5D=patron_status', {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${tokensData.access_token}`
    }
  })
  const userDataJson = await userInfoResponse.json()
  // hardcoded campaign id -- might want to make this an env var...?
  const CAMPAIGN_ID = "3820267"
  const compconCampaignMembership = userDataJson.included.find(membership => membership.relationships.campaign.data.id === CAMPAIGN_ID)
  const isPatron = compconCampaignMembership && compconCampaignMembership.attributes.patron_status === 'active_patron'

  if (!isPatron) {
    res.statusCode = 403;
    res.json({error: 'Not a COMP/CON backer'});
    return;
  }

  const snowflake = uuid.v4()

  let putItemParams = {
    TableName: tableName,
    Item: {
      snowflake,
      access_token: tokensData.access_token,
      expire_timestamp: Date.now() + tokensData.expires_in - 24 * 60 * 60, // -1 day offset from real expiration date to be safe
      refresh_token: tokensData.refresh_token
    }
  }

  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({message: 'error updating DB', error: err, url: req.url, body: req.body});
    } else{
      res.statusCode = 200;
      res.json({ snowflake })
    }
  });
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app