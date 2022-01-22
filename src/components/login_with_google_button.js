import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Auth from '../services/auth'
import Img from 'gatsby-image'

import './login_with_google_button.scss'

const LoginWithGoogleButton = () => {
  const data = useStaticQuery(graphql`
    query GoogleLogo {
      file(relativePath: {eq: "google-g.png"}) {
        childImageSharp {
          fixed (height: 25, width: 25) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)
  return (
    <button className="login-with-google-button" onClick={Auth.googleLogin}>
      <Img fixed={data.file.childImageSharp.fixed} />
      Login with Google
    </button>
  )
}

export default LoginWithGoogleButton
