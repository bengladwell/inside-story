import React, { type FC } from 'react'

import type { User as UserModel } from '../@types/models'

import './user.scss'

const User: FC = ({ user }: { user: UserModel }) => {
  return user.imageUrl !== null
    ? (
    <div className="user">
      <img src={user.imageUrl} className="user__image" />
    </div>
      )
    : null
}

export default User
