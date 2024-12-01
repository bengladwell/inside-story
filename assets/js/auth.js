---
---
async function validateJWT() {
  const token = Cookies.get('idToken')
  if (!token) {
    console.error('ID token not found in cookies.')
    return;
  }

  const jwksUri = '{{ site.user_pool_provider_url }}/.well-known/jwks.json'

  try {
    const response = await fetch(jwksUri)
    const jwks = await response.json()

    const keyStore = jose.createRemoteJWKSet(new URL(jwksUri))

    const { payload } = await jose.jwtVerify(token, keyStore, {
      issuer: '{{ site.user_pool_provider_url }}',
    })

    return payload

  } catch (err) {
    console.error('JWT validation failed:', err);
  }
}

(async () => {
  const { name, picture } = await validateJWT();
  const loginElement = document.querySelector('.login')
  loginElement.style.display = 'none'
  const userElement = document.querySelector('.user')
  userElement.querySelector('img').src = picture
  userElement.style.display = 'block'
})()
