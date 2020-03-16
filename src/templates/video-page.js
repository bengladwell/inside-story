import React from 'react'
import { graphql } from "gatsby"
import Layout from '../components/layout'

const VideoPage = ({
  data: {
    videosYaml: {
      fields: {
        baseName,
        dir,
        label,
        slug
      }
    }
  }
}) => {
  return (
    <Layout>
      <h1>{label}</h1>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    videosYaml(fields: { slug: { eq: $slug } }) {
      fields {
        baseName
        dir
        label
        slug
      }
    }
  }
`

export default VideoPage
