import React from 'react'

import './unauth_message.scss'

const UnauthMessage = () => {
  const unknownUserString = typeof window !== 'undefined' && window.sessionStorage.getItem('unauthorized-user')
  let unknownUser
  try {
    unknownUser = JSON.parse(unknownUserString)
  } catch (e) {
  }

  return unknownUser
    ? (
      <div className="unauth-message unknown-message">
        <p>Hi {unknownUser.name}!</p>
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
