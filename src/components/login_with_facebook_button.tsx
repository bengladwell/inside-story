import React, { type FC } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Auth from '../services/auth'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

import './login_with_facebook_button.scss'

const LoginWithFacebookButton: FC = () => {
  const data = useStaticQuery(graphql`
    query FacebookLogo {
      file(relativePath: {eq: "f_logo_RGB-Blue_58.png"}) {
        childImageSharp {
          gatsbyImageData(
            width: 25
            height: 25
          )
        }
      }
    }
  `)
  return (
    <button className="login-with-facebook-button" onClick={() => { Auth.facebookLogin() }}>
      <GatsbyImage image={getImage(data.file)} />
      Login with Facebook
    </button>
  )
}

export default LoginWithFacebookButton
