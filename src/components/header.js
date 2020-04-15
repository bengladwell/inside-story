import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import './header.scss'

const Header = ({ siteTitle }) => (
  <header
    className='site-header'
    style={{
      marginBottom: '1.45rem'
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960
      }}
    >
      <Link
        className='logo'
        title={siteTitle}
        to='/'
        style={{
          color: 'white',
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
