import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import Layout from '../components/layout'
import VideoList from '../components/video_list'
import SEO from '../components/seo'

const IndexPage = ({ data }) => {
  const videos = data.allVideosYaml.edges.map(edge => ({
    id: edge.node.id,
    label: edge.node.fields.label,
    slug: edge.node.fields.slug,
    year: edge.node.fields.year,
    image: data.allFile.edges.find(fileEdge => fileEdge.node.base === edge.node.fields.image)
  }))
  const firstVideo = videos[0]
  const lastVideo = [...videos].pop()

  return (
    <Layout>
      <SEO title='Home' />
      <h1 className='site-title'>Family Videos: {firstVideo.year} - {lastVideo.year}</h1>

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
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid
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
