import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FaSync } from 'react-icons/fa'
import { useStaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import { userContext } from '../context'
import User from '../models/user'
import UnauthorizedUserError from '../errors/unauthorized_user_error'
import Auth from '../services/auth'
import Header from './header'
import './layout.scss'

const Layout = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { site: { siteMetadata: { title } } } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  useEffect(() => {
    try {
      Auth.receiveHash()
    } catch (e) {
      if (e instanceof UnauthorizedUserError) {
        setUser(new User({ name: e.name, email: e.email, authorized: false }))
      }
    }
    const auth = new Auth()
    if (auth.hasIdentity()) {
      setIsLoading(true)
      Promise.all([
        auth.getUser(),
        auth.authorizeUser()
      ]).then(([user]) => {
        if (user) setUser(user)
        setIsLoading(false)
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }, [])

  return (
    <div className="site-layout">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {
        isLoading
          ? <FaSync className="center-page fa-spin fa-6x" />
          : <userContext.Provider value={user}><Header /><main>{children}</main></userContext.Provider>
      }
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
