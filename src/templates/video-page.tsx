import React, { type FC } from 'react'
import { graphql, type PageProps } from 'gatsby'
import Layout from '../components/layout'
import VideoPlayer from '../components/video_player'
import WithAuth from '../components/with_auth'
import { getSrc } from 'gatsby-plugin-image'

import 'video.js/dist/video-js.css'

const VideoPage: FC = ({
  data: {
    site: {
      siteMetadata: {
        siteURL
      }
    },
    videosYaml: {
      fields: {
        baseName,
        label
      }
    },
    poster,
    thumbnail: {
      childImageSharp: {
        gatsbyImageData: {
          images: {
            fallback: {
              src: thumbnail
            }
          }
        }
      }
    }
  }
}: PageProps<Queries.VideoPageQuery>) => {
  return (
    <Layout>
      <WithAuth>
        <h1>{label}</h1>
        <VideoPlayer
          controls={true}
          poster={getSrc(poster.childImageSharp)}
          html5={{ vhs: { withCredentials: true } }}
        >
          <source
            src={`https://${process.env.VIDEO_DOMAIN}/${baseName}/hls/${baseName}.m3u8`}
            type="application/x-mpegURL"
          />
          <source
            src={`https://${process.env.VIDEO_DOMAIN}/${baseName}/dash/${baseName}.mpd`}
            type="application/dash+xml"
          />
        </VideoPlayer>
      </WithAuth>
    </Layout>
  )
}

export const Head: FC = ({
  data: {
    site: {
      siteMetadata: {
        siteURL
      }
    },
    videosYaml: {
      fields: {
        label
      }
    },
    thumbnail
  }
}: PageProps<Queries.VideoPageQuery>) => {
  <>
    <title>{`%s -- ${label}`}</title>
    <meta name="og:image" content={`${siteURL}${getSrc(thumbnail)}`} />
    <meta name="og:title" content={label} />
  </>
}

export const query = graphql`
  query VideoPage($slug: String!, $image: String!) {
    site {
      siteMetadata {
        siteURL
      }
    }
    videosYaml(fields: { slug: { eq: $slug } }) {
      fields {
        baseName
        dir
        label
        slug
        image
      }
    }
    poster: file(base: {eq: $image}) {
      childImageSharp {
        gatsbyImageData(width: 800)
      }
    }
    thumbnail: file(base: {eq: $image}) {
      childImageSharp {
        gatsbyImageData(width:400)
      }
    }
  }
`

export default VideoPage
