import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import './header.scss'
import Auth from '../services/auth'
import { userContext } from '../context'
import User from './user'

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
        <userContext.Consumer>
          { user => user ? <User user={user} /> : <button className="site-header__login" onClick={Auth.login}>Login</button> }
        </userContext.Consumer>
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
