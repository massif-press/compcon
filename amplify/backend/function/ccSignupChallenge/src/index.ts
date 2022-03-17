exports.handler = (event, context, callback) => {
  // Set the user pool autoConfirmUser flag after validating the email domain
  event.response.autoConfirmUser = false

  const code = event.request.userAttributes.code

  console.log(event)

  console.log(event.request.userAttributes)

  if (code && code === 'test') {
    console.log('code exists')
    event.response.autoConfirmUser = true
  }

  // Return to Amazon Cognito
  callback(null, event)
}
