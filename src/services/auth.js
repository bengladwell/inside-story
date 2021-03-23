import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'
import User from '../models/user'

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ region: 'us-east-1' })
const redirectUri = process.env.NODE_ENV === 'development'
  ? encodeURIComponent('http://localhost:8000/')
  : encodeURIComponent(`https://${process.env.CLOUDFRONT_DOMAIN}/`)

class Auth {
  static receive (hashString) {
    if (typeof window !== 'undefined' && hashString) {
      window.history.replaceState({}, document.title, window.location.href.replace(hashString, ''))

      if (!hashString.match(/error=/)) {
        window.localStorage.setItem('cognito-user', hashString.substr(1))
      } else {
        const matchData = decodeURIComponent(hashString).replaceAll('+', ' ').match(/email=([^;]+?);.+?name=([\w\s]+)/)
        if (matchData) {
          const [, email, name] = matchData
          window.sessionStorage.setItem('unauthorized-user', JSON.stringify({ email, name }))
        }
      }
    }
  }

  static login () {
    window.location = `https://${process.env.USER_POOL_NAME}.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=${process.env.USER_POOL_CLIENT_ID}&redirect_uri=${redirectUri}&identity_provider=Facebook`
  }

  constructor () {
    if (window.localStorage.getItem('cognito-user')) {
      const values = window.localStorage.getItem('cognito-user')
      const params = values.split('&').map(kv => kv.split('=')).reduce((acc, pair) =>
        Object.assign({}, acc, { [pair[0]]: pair[1] })
      , {})
      this.accessToken = params.access_token
      this.idToken = params.id_token
      this.expiresIn = params.expires_in
    }
  }

  authorize () {
    return fetch(`https://${process.env.SIGNER_DOMAIN}${process.env.SIGNER_PATH}`, { method: 'GET', credentials: 'include' })
  }

  getUser () {
    if (!this.idToken) {
      return Promise.resolve()
    }

    return cognitoIdentityServiceProvider
      .getUser({ AccessToken: this.accessToken })
      .promise()
      .then(data => User.fromFacebook(data))
      .catch(err => {
        if (err.message.match(/Token has expired/)) {
          this.clear()
        } else {
          throw err
        }
      })
  }

  clear () {
    this.accessToken = undefined
    this.idToken = undefined
    this.expiresIn = undefined
    window.localStorage.removeItem('cognito-user')
  }
}

export default Auth
