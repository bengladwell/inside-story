import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import './header.scss'
import Auth from '../services/auth'

import jwtDecode from 'jwt-decode'

const auth = new Auth()
if (auth.idToken) {
  console.log(jwtDecode(auth.idToken))
  console.log(jwtDecode(auth.accessToken))
}

const Header = ({ siteTitle }) => {
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
        <button className="site-header__login" onClick={Auth.login}>Login</button>
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
