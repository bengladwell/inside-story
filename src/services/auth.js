import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'
import CognitoIdentity from 'aws-sdk/clients/cognitoidentity'
import User from '../models/user'
import jwtDecode from 'jwt-decode'

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ region: 'us-east-1' })
const cognitoIdentity = new CognitoIdentity({ region: 'us-east-1' })
const userPool = 'cognito-idp.us-east-1.amazonaws.com/us-east-1_ojhYSduq8'
const identityPoolId = 'us-east-1:7750fa7b-1fb4-41b3-8a6b-993cc405f7ef'

class Auth {
  static receive (hashString) {
    if (!hashString.match(/error=/)) {
      window.localStorage.setItem('cognito-user', hashString.substr(1))
      window.history.replaceState({}, document.title, window.location.href.replace(hashString, ''))
    }
  }

  static login () {
    window.location = `https://inside-story.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=${process.env.USER_POOL_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&identity_provider=Facebook`
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
