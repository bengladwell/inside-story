import React, { type FC } from 'react'

import './privacy_message.scss'

const PrivacyMessage: FC = () => {
  return (
    <div className="privacy-message">
      <p>Hi there. When you log in to this site, I retain your name and email address.</p>
      <p>I retain your name and email address so that I can verify your identity and so that I can contact you after I grant you access.</p>
      <p>If you would like me to delete your name and email address, I am happy to do so. Just email me and I will delete your data immediately.</p>
    </div>
  )
}

export default PrivacyMessage
