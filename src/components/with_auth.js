import React from 'react'
import PropTypes from 'prop-types'
import { userContext } from '../context'
import UnauthMessage from './unauth_message'

const WithAuth = ({ children }) => {
  return (
    <userContext.Consumer>
      { user => user ? children : <UnauthMessage /> }
    </userContext.Consumer>
  )
}

WithAuth.propTypes = {
  children: PropTypes.node.isRequired
}

export default WithAuth
