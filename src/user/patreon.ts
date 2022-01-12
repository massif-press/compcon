// import { patreon as patreonAPI, oauth as patreonOAuth } from 'patreon'
// import { format as formatUrl } from 'url'

// const CLIENT_ID = process.env.PATREON_CLIENT_ID
// const CLIENT_SECRET = process.env.PATREON_CLIENT_SECRET
// const patreonOAuthClient = patreonOAuth(CLIENT_ID, CLIENT_SECRET)

// const redirectURL = 'https://ezfwoqs40f.execute-api.us-east-1.amazonaws.com/dev/patreon'

// const loginUrl = function(): string {
//   return formatUrl({
//     protocol: 'https',
//     host: 'patreon.com',
//     pathname: '/oauth2/authorize',
//     query: {
//       response_type: 'code',
//       client_id: CLIENT_ID,
//       redirect_uri: redirectURL,
//       state: 'patreon_auth',
//     },
//   })
// }

// const handleOAuthRedirectRequest = function(code, response): void {
//   const oauthGrantCode = code
//   console.log('handling oauth')

//   patreonOAuthClient
//     .getTokens(oauthGrantCode, redirectURL)
//     .then(tokensResponse => {
//       console.log('have tokensResponse')
//       const patreonAPIClient = patreonAPI(tokensResponse.access_token)
//       console.log(tokensResponse, patreonAPIClient)
//       return patreonAPIClient('/current_user')
//     })
//     .then(({ store }) => {
//       console.log('getting jsonapidatastore')
//       // store is a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore)
//       // You can also ask for result.rawJson if you'd like to work with unparsed data
//       console.log(store)
//       response.end(store.findAll('user').map(user => user.serialize()))
//     })
//     .catch(err => {
//       console.error('error!', err)
//       response.end(err)
//     })
// }

// export { loginUrl, handleOAuthRedirectRequest }

// // import { oauth } from 'patreon'

// // import axios from 'axios'
// //
// // // import { defaultCipherList } from 'constants'

// // const clientId = process.env.PATREON_CLIENT_ID
// // const clientSecret = process.env.PATREON_CLIENT_SECRET
// // const redirect = 'https://beef-backend.d3gu3i4ec3uyxo.amplifyapp.com/oauth'

// // const oauthClient = oauth(clientId, clientSecret)

// // // mimic a database
// // const database = {}

// // // const patreonApi = axios.create({
// // //   baseURL: 'https://patreon.com',
// // //   responseType: 'json',
// // // })

// // export default {
// //   loginEndpoint() {
// //     return loginUrl
// //   },
// //   getUserToken(code, state) {
// //     console.info('Getting patreon token: ', state)
// //     return axios.post('https://www.patreon.com/api/oauth2/token', {
// //       code,
// //       grant_type: 'authorization_code',
// //       client_id: clientId,
// //       client_secret: clientSecret,
// //       redirect_uri: redirect,
// //     })
// //   },
// //   getUserCampaigns(token) {
// //     return axios.get('https://www.patreon.com/api/oauth2/api/current_user', {
// //       headers: {
// //         authorization: `Bearer ${token}`,
// //       },
// //     })
// //   },

// // patreonApi.get('/', (req, res) => {
// //   res.send(`<a href="${loginUrl}">Login with Patreon</a>`)
// // })

// // oauthRedirect() {
// //   axios.get('/oauth/redirect').then((req) => {
// //     const { code } = req.query
// //     let token

// //     return oauthClient
// //       .getTokens(code, redirect)
// //       .then(({ access_token }) => {
// //         token = access_token
// //         const apiClient = patreon(token)
// //         return apiClient('/current_user')
// //       })
// //       .then(({ store, rawJson }) => {
// //         const { id } = rawJson.data
// //         database[id] = { ...rawJson.data, token }
// //         console.log(`Saved user ${store.find('user', id).full_name} to the database`)
// //         return res.redirect(`/protected/${id}`)
// //       })
// //       .catch(err => {
// //         console.log(err)
// //         console.log('Redirecting to login')
// //         res.redirect('/')
// //       })
// //   })
// // },

// // oauthUser() {
// //   patreonApi.get('/protected/:id', (req, res) => {
// //     const { id } = req.params

// //     // load the user from the database
// //     const user = database[id]
// //     if (!user || !user.token) {
// //       return res.redirect('/')
// //     }

// //     const apiClient = patreon(user.token)

// //     // make api requests concurrently
// //     return apiClient('/current_user/campaigns')
// //       .then(({ store }) => {
// //         const _user = store.find('user', id)
// //         const campaign = _user.campaign ? _user.campaign.serialize().data : null
// //         return res.send(_user, campaign)
// //       })
// //       .catch(err => {
// //         const { status, statusText } = err
// //         console.log('Failed to retrieve campaign info')
// //         console.log(err)
// //         return res.json({ status, statusText })
// //       })
// //   })
// // },

// // const server = patreonApi.listen(5000, () => {
// //   const { port } = server.address()
// //   console.log(`Listening on http:/localhost:${port}`)
// // })
// // }
