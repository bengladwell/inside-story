---
---
function removeIdToken() {
  Cookies.remove('idToken', {domain: '{{ site.hosted_zone_domain }}', secure: true, sameSite: 'strict'})
}

function logout() {
  removeIdToken()
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

function notifyUnauth() {
  const contentElement = document.querySelector('main')
  contentElement.innerHTML = document.querySelector('#access-denied-user-template').innerHTML
  contentElement.querySelector('#unauth-message__name').textContent = name
}

function getInitials(name) {
  return name.split(' ').map((word) => word[0].toUpperCase()).join('')
}

(async () => {
  const idToken = Cookies.get('idToken')

  if (!idToken) {
    const contentElement = document.querySelector('main')
    contentElement.innerHTML = document.querySelector('#access-denied-anonymous-template').innerHTML
    return
  }

  try {
    const { name, picture, is_approved: isApproved } = await validateJWT(idToken);
    const loginElement = document.querySelector('.login')
    loginElement.style.display = 'none'
    const userElement = document.querySelector('.user')
    const imageElement = userElement.querySelector('img')
    if (picture) {
      imageElement.src = picture
    } else {
      imageElement.style.display = 'none'
      const initialsElment = userElement.querySelector('.user__initials')
      initialsElment.style.display = 'flex'
      initialsElment.innerText = getInitials(name)
    }
    userElement.style.display = 'block'
    const logoutElement = document.querySelector('.logout')
    logoutElement.style.display = 'block'

    if (isApproved === 'false') {
      notifyUnauth()
      removeIdToken()
      return
    }
  } catch (error) {
    notifyUnauth()
    console.error(error)
  }
})()
