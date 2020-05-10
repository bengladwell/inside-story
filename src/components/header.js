import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import './header.scss'

import CognitoIdentity from 'aws-sdk/clients/cognitoidentity'

const cognitoIdentity = new CognitoIdentity()

const Header = ({ siteTitle }) => {
  const login = async () => {
    const credentials = await cognitoIdentity.getCredentialsForIdentity({
      IdentityId: "us-east-1:7750fa7b-1fb4-41b3-8a6b-993cc405f7ef"
    })
    console.log(credentials)
  }

  return (
    <header className='site-header'>
      <div>
        <Link
          className='logo'
          title={siteTitle}
          to='/'
          style={{
            textDecoration: 'none'
          }}
        >
          G
        </Link>
        <button className="site-header__login" onClick={login}>Login</button>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string
}

Header.defaultProps = {
  siteTitle: ''
}

export default Header
