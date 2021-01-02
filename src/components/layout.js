import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import { userContext } from '../context'
import Auth from '../services/auth'
import Header from './header'
import './layout.scss'

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const [user, setUser] = useState(null)

  useEffect(() => {
    const auth = new Auth()
    auth.authorizeUser().then(resp => console.log(resp))
    auth.getUser()
      .then(user => setUser(user))
      .catch(e => console.log(e))
  }, [])

  return (
    <userContext.Provider value={user}>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div
        style={{
          margin: '0 auto',
          maxWidth: 960
        }}
      >
        <main>{children}</main>
      </div>
    </userContext.Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
