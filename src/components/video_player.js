import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import videojs from 'video.js'

const VideoPlayer = ({ children, ...props }) => {
  const playerEl = useRef()

  useEffect(() => {
    const player = videojs(playerEl.current, props)

    return () => {
      player.dispose()
    }
  }, [])

  return (
    <div>
      <div data-vjs-player>
        <video ref={playerEl} className="video-js">
          {children}
        </video>
      </div>
    </div>
  )
}

export default VideoPlayer

VideoPlayer.propTypes = {
  children: PropTypes.node.isRequired
}
