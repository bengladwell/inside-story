import React, { type FC } from 'react'
import { type PageProps, graphql } from 'gatsby'

import Layout from '../components/layout'
import VideoList from '../components/video_list'
import WithAuth from '../components/with_auth'
import type { Video } from '../@types/models'

type VideosYaml = Queries.VideosYaml & {
  readonly fields: Queries.VideosYamlFields
}

const IndexPage: FC = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const videos: Video[] = data.allVideosYaml.edges
    .filter(edge => edge.node)
    .map(edge => {
      const node = edge.node as VideosYaml
      return {
        id: edge.node.id,
        label: node.fields.label,
        slug: node.fields.slug,
        year: node.fields.year,
        image: data.allFile.edges.find(fileEdge => fileEdge.node.base === node.fields.image)
      }
    })

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
