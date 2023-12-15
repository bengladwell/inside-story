import React, { type ReactNode, type FC } from 'react'
import PropTypes from 'prop-types'
import { userContext } from '../context'
import UnauthMessage from './unauth_message'

const WithAuth: FC = ({ children }: { children: ReactNode }) => {
  return (
    <userContext.Consumer>
      { user => user !== null && user.authorized ? children : <UnauthMessage user={user} /> }
    </userContext.Consumer>
  )
}

WithAuth.propTypes = {
  children: PropTypes.node.isRequired
}

export default WithAuth
