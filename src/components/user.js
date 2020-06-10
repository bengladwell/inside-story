import React from 'react'

import { userPropType } from '../models/user'

import './user.scss'

const User = ({ user }) => {
  return (
    <div className="user">
      <img src={user.imageUrl} className="user__image" />
    </div>
  )
}

User.propTypes = {
  user: userPropType
}

export default User
