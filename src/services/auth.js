import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'
import CognitoIdentity from 'aws-sdk/clients/cognitoidentity'
import User from '../models/user'

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ region: 'us-east-1' })
const cognitoIdentity = new CognitoIdentity({ region: 'us-east-1' })
const userPool = `cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID}`
const identityPoolId = process.env.IDENTITY_POOL_ID

class Auth {
  static receive (hashString) {
    if (!hashString.match(/error=/)) {
      window.localStorage.setItem('cognito-user', hashString.substr(1))
      window.history.replaceState({}, document.title, window.location.href.replace(hashString, ''))
    } else if (hashString.match(/Unknown.user/)) {
      window.history.replaceState({}, document.title, window.location.href.replace(hashString, ''))
    }
  }

  static login () {
    window.location = `https://${process.env.USER_POOL_DOMAIN}.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=${process.env.USER_POOL_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&identity_provider=Facebook`
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

  authorizeUser () {
    if (!this.idToken) {
      return Promise.resolve()
    }

    return cognitoIdentity.getId({
      IdentityPoolId: identityPoolId,
      Logins: {
        [userPool]: this.idToken
      }
    })
      .promise()
      .then(({ IdentityId }) => {
        return cognitoIdentity.getCredentialsForIdentity({
          IdentityId,
          Logins: {
            [userPool]: this.idToken
          }
        }).promise()
      })
      .then(({ Credentials: credentials }) => credentials)
      .catch(err => {
        if (err.message.match(/Token expired/)) {
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
