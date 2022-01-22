import { Link, useStaticQuery, graphql } from 'gatsby'
import React from 'react'
import './header.scss'
import { userContext } from '../context'
import User from './user'
import LoginWithFacebookButton from './login_with_facebook_button'
import LoginWithGoogleButton from './login_with_google_button'

const Header = () => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
      allVideosYaml(sort: {fields: year}) {
        edges {
          node {
            id
            fields {
              year
            }
          }
        }
      }
    }
  `)

  const videos = data.allVideosYaml.edges.map(edge => ({
    id: edge.node.id,
    label: edge.node.fields.label,
    slug: edge.node.fields.slug,
    year: edge.node.fields.year
  }))
  const firstVideo = videos[0]
  const lastVideo = [...videos].pop()

  return (
    <header className='site-header'>
      <div>
        <p>
          <Link
            className='logo'
            title={data.site.siteMetadata.title}
            to='/'
            style={{
              textDecoration: 'none'
            }}
          >
            {data.site.siteMetadata.title}
          </Link>
        </p>
        <p>{firstVideo.year} - {lastVideo.year}</p>
        <userContext.Consumer>
          {
            user => user && user.authorized
              ? <User user={user} />
              : (
                <>
                  <LoginWithFacebookButton />
                  <LoginWithGoogleButton />
                </>
              )
          }
        </userContext.Consumer>
        <Link
          className="privacy"
          to='/privacy/'
          style={{
            textDecoration: 'none'
          }}
        >
          Privacy Policy
        </Link>
      </div>
    </header>
  )
}

export default Header
