import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import Layout from '../components/layout'
import VideoList from '../components/video_list'
import SEO from '../components/seo'
import Auth from '../services/auth'

if (window && window.location.hash) {
  Auth.receive(window.location.hash)
}

const IndexPage = ({ data }) => {
  const videos = data.allVideosYaml.edges.map(edge => ({
    id: edge.node.id,
    label: edge.node.fields.label,
    slug: edge.node.fields.slug,
    year: edge.node.fields.year,
    image: data.allFile.edges.find(fileEdge => fileEdge.node.base === edge.node.fields.image)
  }))

  // We don't really want to use the setup described in the various gatsby tutorials on
  // authentication. Those focus on client-only pages. But we do want our video pages to
  // be statically available so that the proper meta tags can show the video thumbnail
  // and such.
  // We should build a CheckAuth component or something that renders children when
  // authenticated and renders a login message if not. Just regular React stuff.
  // This should also force <video> elements to not be rendered until _after_ auth
  // stuff is pushed into videojs.
  return (
    <Layout>
      <SEO title='Home' />
      <VideoList videos={videos} />
    </Layout>
  )
}

export const query = graphql`
  query {
    allVideosYaml(sort: {fields: year}) {
      edges {
        node {
          id
          fields {
            slug
            label
            year
            image
          }
        }
      }
    }
    allFile(filter: {extension: {eq: "jpg"}}) {
      edges {
        node {
          base
          childImageSharp {
            fixed(width: 300, height: 300) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`

IndexPage.propTypes = {
  data: PropTypes.shape({
    allVideosYaml: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string.isRequired,
          fields: PropTypes.shape({
            slug: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            year: PropTypes.number.isRequired
          })
        })
      }))
    }),
    allFile: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.shape({
        node: PropTypes.shape({
          base: PropTypes.string.isRequired,
          childImageSharp: PropTypes.shape({
            fluid: PropTypes.shape({
              aspectRatio: PropTypes.number.isRequired,
              base64: PropTypes.string.isRequired,
              sizes: PropTypes.string.isRequired,
              src: PropTypes.string.isRequired,
              srcSet: PropTypes.string.isRequired
            })
          })
        })
      }))
    })
  })
}

export default IndexPage
