import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'
import Cookies from 'js-cookie'
import User from '../models/user'
import UnauthorizedUserError from '../errors/unauthorized_user_error'

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ region: 'us-east-1' })
const redirectUri = process.env.NODE_ENV === 'development'
  ? encodeURIComponent('http://localhost:8000/')
  : encodeURIComponent(`https://${process.env.SITE_DOMAIN}/`)

class Auth {
  static receiveHash () {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashString = window.location.hash.substr(1)
      window.history.replaceState({}, document.title, window.location.href.replace(window.location.hash, ''))

      if (Auth.hasError(hashString)) {
        Auth.handleError(hashString)
      } else {
        Auth.saveIdentityCookies(hashString)
      }
    }
  }

  static hasError (hashString) {
    return hashString.match(/error(_description)?=/)
  }

  static saveIdentityCookies (hashString) {
    const params = hashString.split('&').map(kv => kv.split('=')).reduce((acc, pair) =>
      Object.assign({}, acc, { [pair[0]]: pair[1] })
    , {})
    const millisecondsNow = (new Date()).valueOf()
    const expires = new Date(millisecondsNow + params.expires_in * 1000)

    if (params.access_token && params.id_token) {
      Cookies.set('accessToken', params.access_token, { expires })
      Cookies.set('idToken', params.id_token, { expires })
    }
  }

  static handleError (hashString) {
    const matchData = decodeURIComponent(hashString).replaceAll('+', ' ').match(/email=([^;]+?);.+?name=([\w\s]+)/)
    if (matchData) {
      const [, email, name] = matchData
      throw new UnauthorizedUserError(name, email)
    } else {
      throw new Error(hashString)
    }
  }

  static facebookLogin () {
    window.location = `https://${process.env.USER_POOL_NAME}.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=${process.env.USER_POOL_CLIENT_ID}&redirect_uri=${redirectUri}&identity_provider=Facebook`
  }

  constructor () {
    this.accessToken = Cookies.get('accessToken')
    this.idToken = Cookies.get('idToken')
  }

  hasIdentity () {
    return Boolean(this.accessToken && this.idToken)
  }

  authorizeUser () {
    if (!this.accessToken) throw new Error('Missing accessToken')

    return fetch(`https://${process.env.SIGNER_DOMAIN}${process.env.SIGNER_PATH}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    })
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
  }
}

export default Auth
