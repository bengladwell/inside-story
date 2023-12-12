import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

import './video_list.scss'

// TODO: video needs washed out a bit; title over top
const VideoList = ({ videos }) => {
  return (
  <ul className='video-list'>
    {videos.map(({ id, slug, label, image }) => {
      return (
      <li className="video" key={id}>
        <Link to={`/${slug}`}>
          { image && <GatsbyImage image={getImage(image.node.childImageSharp)} /> }
          <div className="video__name">{label}</div>
        </Link>
      </li>
    )})}
  </ul>
)
}

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
