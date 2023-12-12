import type { GatsbyConfig } from 'gatsby'
import dotenv from 'dotenv'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Gladwell Family Videos',
    description: 'Birthday videos for Hudson and Mesfin',
    author: '@bengladwell',
    siteURL: `https://${process.env.SITE_DOMAIN}`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: 'gatsby-plugin-s3',
      options: {
        bucketName: process.env.SITE_BUCKET ?? 'inside-story',
        protocol: 'https',
        hostname: process.env.SITE_DOMAIN
      }
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: `https://${process.env.SITE_DOMAIN}`
      }
    },
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/'
      },
      __key: 'images'
    },
    'gatsby-transformer-yaml',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: './src/data/'
      }
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp'
  ]
}

export default config
