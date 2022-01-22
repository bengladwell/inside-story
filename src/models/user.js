import PropTypes from 'prop-types'

class User {
  static fromIdp (data) {
    const name = data.UserAttributes.find(attr => attr.Name === 'name').Value
    const email = data.UserAttributes.find(attr => attr.Name === 'email').Value
    const picture = data.UserAttributes.find(attr => attr.Name === 'picture').Value
    if (data.Username.match(/^google/)) {
      return new User({ name, email, imageUrl: picture })
    }
    return new User({ name, email, imageUrl: JSON.parse(picture).data.url })
  }

  constructor ({ name = null, email = null, imageUrl = null, authorized = true }) {
    Object.assign(this, { name, email, imageUrl, authorized })
  }
}

export default User

const userPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
})

export { userPropType }
