---
---
function logout() {
  Cookies.remove('idToken', {domain: '{{ site.hosted_zone_domain }}', secure: true, sameSite: 'strict'})
  location.reload()
}

async function validateJWT(token) {
  const jwksUri = '{{ site.user_pool_provider_url }}/.well-known/jwks.json'

  const response = await fetch(jwksUri)
  const jwks = await response.json()

  const keyStore = jose.createRemoteJWKSet(new URL(jwksUri))

  const { payload } = await jose.jwtVerify(token, keyStore, {
    issuer: '{{ site.user_pool_provider_url }}',
  })

  return payload

}

(async () => {
  const idToken = Cookies.get('idToken')

  if (!idToken) return

  try {
    const { name, picture } = await validateJWT(idToken);
    const loginElement = document.querySelector('.login')
    loginElement.style.display = 'none'
    const userElement = document.querySelector('.user')
    userElement.querySelector('img').src = picture
    userElement.style.display = 'block'
    const logoutElement = document.querySelector('.logout')
    logoutElement.style.display = 'block'
  } catch (error) {
    console.error(error)
  }
})()
