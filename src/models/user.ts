import { type User as UserModel } from '../@types/models'

class User {
  static fromIdp (data) {
    const name = data.UserAttributes.find(attr => attr.Name === 'name').Value
    const email = data.UserAttributes.find(attr => attr.Name === 'email').Value
    const picture = data.UserAttributes.find(attr => attr.Name === 'picture').Value
    if (data.Username.match(/^google/)) {
      return new User({ name, email, imageUrl: picture })
    }
    try {
      return new User({ name, email, imageUrl: JSON.parse(picture).data.url })
    } catch (e) {
      return new User({ name, email })
    }
  }

  constructor ({ name, email, imageUrl = null, authorized = true }: UserModel) {
    Object.assign(this, { name, email, imageUrl, authorized })
  }
}

export default User
