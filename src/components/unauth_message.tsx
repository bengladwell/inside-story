import React, { type FC } from 'react'

import type { User } from '../@types/models'

import './unauth_message.scss'

const UnauthMessage: FC = ({ user }: { user: User | null }) => {
  return user !== null
    ? (
      <div className="unauth-message unknown-message">
        <p>Hi {user.name}!</p>
        <p>I have been notified that you would like to view this site.</p>
        <p>Assuming I know you, I{"'"}ll add you to the list and send you an email.</p>
      </div>
      )
    : (
      <div className="unauth-message">
        <p>Hi!</p>
        <p>These videos are for my family and friends.</p>
        <p>Please reach out if you would like access.</p>
        <p className="unauth-message__small">
          Your email address must be added to the list.
          Then you will be able to login with Facebook.
        </p>
      </div>
      )
}

export default UnauthMessage
