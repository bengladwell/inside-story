import React, { type FC } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Auth from '../services/auth'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

import './login_with_google_button.scss'

const LoginWithGoogleButton: FC = () => {
  const data = useStaticQuery(graphql`
    query GoogleLogo {
      file(relativePath: {eq: "google-g.png"}) {
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
    <button className="login-with-google-button" onClick={() => { Auth.googleLogin() }}>
      <GatsbyImage image={getImage(data.file)} />
      Login with Google
    </button>
  )
}

export default LoginWithGoogleButton
