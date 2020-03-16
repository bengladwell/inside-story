/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const _ = require('lodash')
const path = require('path')

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'VideosYaml') {
    createNodeField({ node, name: 'dir', value: node.dir })
    createNodeField({ node, name: 'baseName', value: node.base_name })
    createNodeField({ node, name: 'label', value: node.label })
    createNodeField({ node, name: 'slug', value: _.kebabCase(node.label) })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allVideosYaml {
        edges {
          node {
            fields {
              slug
              label
              dir
              baseName
            }
          }
        }
      }
    }
  `)

  result.data.allVideosYaml.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve('./src/templates/video-page.js'),
      context: {
        ...node.fields
      }
    })
  })
}
