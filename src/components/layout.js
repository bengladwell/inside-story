import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import S3 from 'aws-sdk/clients/s3'
import videojs from 'video.js'
import { useStaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import { userContext } from '../context'
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

  /* States
   * hasIdentity - identity is 2 JWT tokens returned from Cognito, identity and access;
   *   expires 60 minutes; required for showing user name;
   *   store in localStorage along with expiresIn
   * hasAuthorization - 3 cookies from API Gateway; expires whenever I want;
   *
   * hasIdentity && hasAuthorization required to render authenticated view
   *
   * Alternative: switch to Authorization Code Grant; make refresh token expiration the same as cookie expiration;
   *   when calling getUser, first check expiration and call `initiateAuth` if necessary for new token;
   *   would also have to handle expiration of refreshToken
   */

  useEffect(() => {
    const auth = new Auth()
    setIsLoading(true)
    auth.authorize().then(() => setIsLoading(false))
    // ingest and clear url hash params
    // react to identity cookie: retrieve auth cookie
    // react to indeterminite auth state: clear [perhaps this should live in Auth constructor?]
    // react to complete auth state: verify
    //
    // For testing:
    // First, just make the call to the API gateway authorizer to get the signed cookies; get video retrieval working
  }, [])

  // useEffect(() => {
  //   const auth = new Auth()
  //   setIsLoading(true)
  //   Promise.all([
  //     auth.authorizeUser(),
  //     auth.getUser()
  //   ]).then(([authResp, user]) => {
  //     setIsLoading(false)
  //     if (user) setUser(user)
  //     videojs.Vhs.xhr.beforeRequest = (options) => {
  //       const uriMatch = options.uri.match(/:\/\/([^.]+).+?\/(.+)/)
  //       if (!uriMatch) {
  //         return options
  //       }
  //       const [, bucket, key] = uriMatch
  //       const s3 = new S3({
  //         apiVersion: 'latest',
  //         credentials: {
  //           accessKeyId: authResp.AccessKeyId,
  //           secretAccessKey: authResp.SecretKey,
  //           sessionToken: authResp.SessionToken
  //         }
  //       })
  //       const signedUri = s3.getSignedUrl('getObject', {
  //         Bucket: bucket,
  //         Key: key
  //       })
  //       options.uri = signedUri
  //       return options
  //     }
  //   })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [])

  return (
    <div className="site-layout">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <userContext.Provider value={user}>
        <Header />
        { isLoading ? null : <main>{children}</main> }
      </userContext.Provider>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
