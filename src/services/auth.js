class Auth {
  static receive (hashString) {
    window.localStorage.setItem('cognito-user', hashString.substr(1))
    window.history.replaceState({}, document.title, window.location.href.replace(hashString, ''))
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
}

export default Auth
