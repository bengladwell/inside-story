import React from 'react'

import { userPropType } from '../models/user'

import './user.scss'

const User = ({ user }) => {
  return user.imageUrl ? (
    <div className="user">
      <img src={user.imageUrl} className="user__image" />
    </div>
  ) : null
}

User.propTypes = {
  user: userPropType
}

export default User
