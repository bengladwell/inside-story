/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

import path from 'path'
import type { GatsbyNode } from 'gatsby'
import type { VideoNode } from './src/@types/graphql'

const toKebabCase = (str: string): string => {
  return str.replace(/\s+/g, '-').toLowerCase()
}

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'VideosYaml') {
    const videoNode = node as VideoNode
    createNodeField({ node, name: 'dir', value: videoNode.dir })
    createNodeField({ node, name: 'baseName', value: videoNode.base_name })
    createNodeField({ node, name: 'label', value: videoNode.label })
    createNodeField({ node, name: 'year', value: videoNode.year })
    createNodeField({ node, name: 'image', value: videoNode.image })
    createNodeField({ node, name: 'slug', value: toKebabCase(videoNode.label) })
  }
}

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions: { createTypes } }) => {
  createTypes(`
    type VideosYamlFields {
      slug: String!
      label: String!
      year: Int!
      dir: String!
      baseName: String!
      image: String!
    }
  `)
}

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query GetAllVideos {
      allVideosYaml {
        edges {
          node {
            fields {
              slug
              label
              year
              dir
              baseName
              image
            }
          }
        }
      }
    }
  `)

  result.data.allVideosYaml.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve('./src/templates/video-page.tsx'),
      context: {
        ...node.fields
      }
    })
  })
}
