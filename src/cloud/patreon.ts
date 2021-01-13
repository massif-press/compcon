/* eslint-disable @typescript-eslint/camelcase */
import { oauth, patreon } from 'patreon'

import axios from 'axios'
import { format as formatUrl } from 'url'
// import { defaultCipherList } from 'constants'

// const clientId = process.env.PATREON_CLIENT_ID
const clientId = 'HzavAk66tgiBKeQ_MsCbq4vg4eL1CBu5r6qEJt-IZ0ykHEtqp3KOupQIX1ywNSrB'
// const clientSecret = process.env.PATREON_CLIENT_SECRET
const clientSecret = 'qgSRlOclEcljt_G6cJWKvR5mn_cLi3pTJHW_QfKHhGDUeiygdS2L58nDg8UD33Jp'
// redirect_uri should be the full redirect url
const redirect = 'https://compcon.app'

const oauthClient = oauth(clientId, clientSecret)

// mimic a database
const database = {}

const loginUrl = formatUrl({
  protocol: 'https',
  host: 'patreon.com',
  pathname: '/oauth2/authorize',
  query: {
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirect,
    state: 'chill',
  },
})

const patreonApi = axios.create({
  baseURL: 'https://patreon.com',
  responseType: 'json',
})

export default {
  loginEndpoint() {
    return loginUrl
  },

  // patreonApi.get('/', (req, res) => {
  //   res.send(`<a href="${loginUrl}">Login with Patreon</a>`)
  // })

  // oauthRedirect() {
  //   axios.get('/oauth/redirect').then((req) => {
  //     const { code } = req.query
  //     let token

  //     return oauthClient
  //       .getTokens(code, redirect)
  //       .then(({ access_token }) => {
  //         token = access_token // eslint-disable-line camelcase
  //         const apiClient = patreon(token)
  //         return apiClient('/current_user')
  //       })
  //       .then(({ store, rawJson }) => {
  //         const { id } = rawJson.data
  //         database[id] = { ...rawJson.data, token }
  //         console.log(`Saved user ${store.find('user', id).full_name} to the database`)
  //         return res.redirect(`/protected/${id}`)
  //       })
  //       .catch(err => {
  //         console.log(err)
  //         console.log('Redirecting to login')
  //         res.redirect('/')
  //       })
  //   })
  // },

  // oauthUser() {
  //   patreonApi.get('/protected/:id', (req, res) => {
  //     const { id } = req.params

  //     // load the user from the database
  //     const user = database[id]
  //     if (!user || !user.token) {
  //       return res.redirect('/')
  //     }

  //     const apiClient = patreon(user.token)

  //     // make api requests concurrently
  //     return apiClient('/current_user/campaigns')
  //       .then(({ store }) => {
  //         const _user = store.find('user', id)
  //         const campaign = _user.campaign ? _user.campaign.serialize().data : null
  //         return res.send(_user, campaign)
  //       })
  //       .catch(err => {
  //         const { status, statusText } = err
  //         console.log('Failed to retrieve campaign info')
  //         console.log(err)
  //         return res.json({ status, statusText })
  //       })
  //   })
  // },

  // const server = patreonApi.listen(5000, () => {
  //   const { port } = server.address()
  //   console.log(`Listening on http:/localhost:${port}`)
  // })
}
