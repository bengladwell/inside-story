import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import './video_list.scss'

// TODO: video needs washed out a bit; title over top
const VideoList = ({ videos }) => (
  <ul className='video-list'>
    {videos.map(({ id, slug, label, image }) => (
      <li className="video" key={id}>
        <Img fluid={image.node.childImageSharp.fluid} />
        <div className="video__name">
          <Link to={`/${slug}`}>{label}</Link>
        </div>
      </li>
    ))}
  </ul>
)

VideoList.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    // image: data.allFile.edges.find(fileEdge => fileEdge.node.base === edge.node.fields.image)
  }))
}

export default VideoList
