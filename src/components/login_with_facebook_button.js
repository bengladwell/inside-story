import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Auth from '../services/auth'
import Img from 'gatsby-image'

import './login_with_facebook_button.scss'

const LoginWithFacebookButton = () => {
  const data = useStaticQuery(graphql`
    query FacebookLogo {
      file(relativePath: {eq: "f_logo_RGB-Blue_58.png"}) {
        childImageSharp {
          fixed (height: 25, width: 25) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)
  return (
    <button className="login-with-facebook-button" onClick={Auth.facebookLogin}>
      <Img fixed={data.file.childImageSharp.fixed} />
      Login with Facebook
    </button>
  )
}

export default LoginWithFacebookButton
