import React from 'react'
import { graphql, Link } from 'gatsby'
import PropTypes from 'prop-types'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

const IndexPage = ({ data }) => {
  const videos = data.allVideosYaml.edges.map(edge => ({
    id: edge.node.id,
    label: edge.node.fields.label,
    slug: edge.node.fields.slug,
    year: edge.node.fields.year
  }))
  const firstVideo = videos[0]
  const lastVideo = [...videos].pop()

  return (
    <Layout>
      <SEO title='Home' />
      <h1>Family Videos: {firstVideo.year} - {lastVideo.year}</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
        <Image />
      </div>

      <ul>
        {videos.map(({ id, slug, label }) => (
          <li key={id}><Link to={slug}>{label}</Link></li>
        ))}
      </ul>
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
    })
  })
}

export default IndexPage
