import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import VideoPlayer from '../components/video_player'
import WithAuth from '../components/with_auth'

import 'video.js/dist/video-js.css'

const VideoPage = ({
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
    poster: {
      childImageSharp: {
        fluid: {
          src: poster
        }
      }
    },
    thumbnail: {
      childImageSharp: {
        fixed: {
          src: thumbnail
        }
      }
    }
  }
}) => {
  return (
    <Layout>
      <Helmet titleTemplate={`%s -- ${label}`}>
        <meta name="og:image" content={`${siteURL}${thumbnail}`} />
        <meta name="og:title" content={label} />
      </Helmet>
      <WithAuth>
        <h1>{label}</h1>
        <VideoPlayer
          controls={true}
          height={432}
          width={768}
          poster={poster}
        >
          <source
            src={`https://transcodekit.s3.amazonaws.com/assets/${baseName}/hls/${baseName}.m3u8`}
            type="application/x-mpegURL"
          />
          <source
            src={`https://transcodekit.s3.amazonaws.com/assets/${baseName}/dash/${baseName}.mpd`}
            type="application/dash+xml"
          />
        </VideoPlayer>
      </WithAuth>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $image: String!) {
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
        fluid(maxWidth: 800) {
          presentationHeight
          presentationWidth
          sizes
          srcSet
          src
        }
      }
    }
    thumbnail: file(base: {eq: $image}) {
      childImageSharp {
        fixed(width: 400) {
        ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

export default VideoPage

VideoPage.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        siteURL: PropTypes.string.isRequired
      })
    }),
    videosYaml: PropTypes.shape({
      fields: PropTypes.shape({
        baseName: PropTypes.string.isRequired,
        dir: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired
      })
    }),
    poster: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.shape({
          src: PropTypes.string.isRequired
        })
      })
    }),
    thumbnail: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fixed: PropTypes.shape({
          src: PropTypes.string.isRequired
        })
      })
    })
  })
}
