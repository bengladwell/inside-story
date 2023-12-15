import React, { useEffect, useRef, type FC, type ReactElement } from 'react'

import videojs from 'video.js'

const VideoPlayer: FC<VideoPlayerProps> = ({ children, ...props }) => {
  const playerEl = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (playerEl.current != null) {
      const player = videojs(playerEl.current, props)

      return () => {
        player.dispose()
      }
    }
  }, [])

  return (
    <div>
      <div data-vjs-player>
        <video ref={playerEl} className="video-js vjs-fluid vjs-16-9">
          {children}
        </video>
      </div>
    </div>
  )
}

export default VideoPlayer

interface VideoPlayerProps {
  children: ReactElement
}
