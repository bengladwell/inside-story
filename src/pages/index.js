import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import Layout from '../components/layout'
import VideoList from '../components/video_list'
import Auth from '../services/auth'
import WithAuth from '../components/with_auth'

if (typeof window !== 'undefined' && window.location.hash) {
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

  return (
    <Layout>
      <WithAuth>
        <VideoList videos={videos} />
      </WithAuth>
    </Layout>
  )
}

export const query = graphql`
  query {
    allVideosYaml {
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
