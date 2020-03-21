import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import './header.scss'

const Header = ({ siteTitle }) => (
  <header
    className='site-header'
    style={{
      // background: 'rebeccapurple',
      marginBottom: '1.45rem'
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960
        // padding: `${rhythm(0.9)} ${rhythm(0.69)}`
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          title={siteTitle}
          to='/'
          style={{
            color: 'white',
            textDecoration: 'none'
            // ...scale(0.2)
          }}
        >
          G
        </Link>
      </h1>
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
