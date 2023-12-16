import React, { type FC } from 'react'
import { Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import type { Video } from '../@types/models'

import './video_list.scss'

// TODO: video needs washed out a bit; title over top
const VideoList: FC = ({ videos }: { videos: Video[] }) => {
  return (
  <ul className='video-list'>
    {videos.map(({ id, slug, label, image }) => {
      return (
        <li className="video" key={id}>
          <Link to={`/${slug}`}>
            { <GatsbyImage image={getImage(image.node.childImageSharp)} /> }
            <div className="video__name">{label}</div>
          </Link>
        </li>
      )
    })}
  </ul>
  )
}

export default VideoList
