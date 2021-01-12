import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import S3 from 'aws-sdk/clients/s3'
import videojs from 'video.js'

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
    Promise.all([
      auth.authorizeUser(),
      auth.getUser()
    ]).then(([authResp, user]) => {
      if (user) setUser(user)
      videojs.Vhs.xhr.beforeRequest = (options) => {
        const uriMatch = options.uri.match(/:\/\/([^.]+).+?\/(.+)/)
        if (!uriMatch) {
          return options
        }
        const [, bucket, key] = uriMatch
        const s3 = new S3({
          apiVersion: 'latest',
          credentials: {
            accessKeyId: authResp.AccessKeyId,
            secretAccessKey: authResp.SecretKey,
            sessionToken: authResp.SessionToken
          }
        })
        const signedUri = s3.getSignedUrl('getObject', {
          Bucket: bucket,
          Key: key
        })
        options.uri = signedUri
        return options
      }
    })
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
