import React, { type FC } from 'react'
import { type PageProps, graphql } from 'gatsby'

import Layout from '../components/layout'
import VideoList from '../components/video_list'
import WithAuth from '../components/with_auth'

const IndexPage: FC = ({ data }: PageProps<Queries.IndexPageQuery>) => {
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
  query IndexPage {
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
            gatsbyImageData(
              width: 300
              height: 300
            )
          }
        }
      }
    }
  }
`

export default IndexPage
