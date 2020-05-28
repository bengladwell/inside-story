import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import './header.scss'

// import CognitoIdentity from 'aws-sdk/clients/cognitoidentity'
import AWS from 'aws-sdk'

// const cognitoIdentity = new CognitoIdentity()

const Header = ({ siteTitle }) => {
  // https://docs.aws.amazon.com/cognito/latest/developerguide/facebook.html#using-facebook-1.javascript
  const login = () => {
    FB.login((response) => {

      // Check if the user logged in successfully.
      if (response.authResponse) {
        console.log('You are now logged in.')

        // Add the Facebook access token to the Cognito credentials login map.
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.IDENTITY_POOL_ID,
          Logins: {
            'graph.facebook.com': response.authResponse.accessToken
          }
        })

        // Obtain AWS credentials
        AWS.config.credentials.get(() => {
          // Access AWS resources here.
        })
      } else {
        console.log('There was a problem logging you in.')
      }
    })
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
