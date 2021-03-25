import PropTypes from 'prop-types'

class User {
  static fromFacebook (data) {
    const name = data.UserAttributes.find(attr => attr.Name === 'name').Value
    const email = data.UserAttributes.find(attr => attr.Name === 'email').Value
    const pictureData = JSON.parse(data.UserAttributes.find(attr => attr.Name === 'picture').Value)
    return new User({ name, email, imageUrl: pictureData.data.url })
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
