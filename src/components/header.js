import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import './header.scss'

const Header = ({ siteTitle }) => (
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
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string
}

Header.defaultProps = {
  siteTitle: ''
}

export default Header
