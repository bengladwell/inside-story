import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import S3 from 'aws-sdk/clients/s3'
import videojs from 'video.js'

import { userContext } from '../context'
import Auth from '../services/auth'
import Header from './header'
import './layout.scss'

const Layout = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const auth = new Auth()
    setIsLoading(true)
    Promise.all([
      auth.authorizeUser(),
      auth.getUser()
    ]).then(([authResp, user]) => {
      setIsLoading(false)
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
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="site-layout">
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
