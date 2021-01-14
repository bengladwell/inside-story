import { Link, useStaticQuery, graphql } from 'gatsby'
import React from 'react'
import './header.scss'
import { userContext } from '../context'
import User from './user'
import LoginWithFacebookButton from './login_with_facebook_button'

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
          { user => user ? <User user={user} /> : <LoginWithFacebookButton /> }
        </userContext.Consumer>
      </div>
    </header>
  )
}

export default Header
