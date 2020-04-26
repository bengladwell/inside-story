import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import VideoPlayer from '../components/video_player'

import 'video.js/dist/video-js.css'

const VideoPage = ({
  data: {
    videosYaml: {
      fields: {
        baseName,
        label
      }
    },
    file: {
      childImageSharp: {
        fluid: {
          src: poster
        }
      }
    }
  }
}) => {
  return (
    <Layout>
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
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $image: String!) {
    videosYaml(fields: { slug: { eq: $slug } }) {
      fields {
        baseName
        dir
        label
        slug
      }
    }
    file(base: {eq: $image}) {
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
  }
`

export default VideoPage

VideoPage.propTypes = {
  data: PropTypes.shape({
    videosYaml: PropTypes.shape({
      fields: PropTypes.shape({
        baseName: PropTypes.string.isRequired,
        dir: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired
      })
    }),
    file: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.shape({
          src: PropTypes.string.isRequired
        })
      })
    })
  })
}
