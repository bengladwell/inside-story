import React, { useEffect, useState, type FC, type ReactElement } from 'react'
import { FaSync } from 'react-icons/fa'
import { useStaticQuery, graphql } from 'gatsby'

import { userContext } from '../context'
import User from '../models/user'
import UnauthorizedUserError from '../errors/unauthorized_user_error'
import Auth from '../services/auth'
import Header from './header'
import './layout.scss'

const Layout: FC<{ children: ReactElement }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
        if (user !== null) setUser(user)
        setIsLoading(false)
      }).catch(() => {
        setIsLoading(false)
      })
    }
  }, [])

  return (
    <div className="site-layout">
      {
        isLoading
          ? <FaSync className="center-page fa-spin fa-6x" />
          : <userContext.Provider value={user}><Header /><main>{children}</main></userContext.Provider>
      }
    </div>
  )
}

export const Head: FC = () => {
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
  return <title>{title}</title>
}

export default Layout
