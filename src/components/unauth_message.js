import React from 'react'

import './unauth_message.scss'

const UnauthMessage = () => {
  return (
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
