import React, {useEffect, useRef, useState, forwardRef} from 'react';
import * as IVSPlayer from 'amazon-ivs-player';


const config = {
  wasmWorker: "https://player.live-video.net/1.2.0/amazon-ivs-wasmworker.min.js",
  wasmBinary: "https://player.live-video.net/1.2.0/amazon-ivs-wasmworker.min.wasm",
}
const player = IVSPlayer.create(config);

const AmazonIvsReact = forwardRef(({
  width = 'auto',
  height = 300,
  controls = false,
  url = "",
  playing = false,
  playbackRate = 1,
  muted = false,
  onProgress = (e) => {},
  onDuration = (e) => {},
  onEnded = () => {},
}, ref = (e) => {}) => {

    const videoEl = useRef(null);

    const round = (number, round = 0) => {
      let factor = Math.pow(10, round);
      return Math.round(number*factor) / factor
    }


    const addListeners = () => {
      player.addEventListener(IVSPlayer.PlayerEventType.DURATION_CHANGED, (e) => {
        onDuration(round(e, 4));
      })
      
      player.addEventListener(IVSPlayer.PlayerEventType.TIME_UPDATE, (e) => {
        let duration = player.getDuration()
        onProgress({played: round(e / duration, 4), playedSeconds: round(e, 4)});
        
        if (player.getState() == "Ended") {
          player.pause();
          onEnded(player);
        }
      })
    }


    const removeListeners = () => {
      player.removeEventListener(IVSPlayer.PlayerEventType.DURATION_CHANGED, (e) => {})
      player.removeEventListener(IVSPlayer.PlayerEventType.TIME_UPDATE, (e) => {})
    }


    // effects -----
    useEffect(() => (playing ? player.play() : player.pause()), [playing])
    
    useEffect(() => player.setPlaybackRate(playbackRate), [playbackRate])
    
    useEffect(() => player.load(url), [url])
    
    useEffect(() => {
      removeListeners();
      addListeners();
    }, [onProgress, onDuration, onEnded])
    
    useEffect(() => {
      ref(player)
      removeListeners()

      if (IVSPlayer.isPlayerSupported) {
        player.attachHTMLVideoElement(videoEl.current)
        addListeners();
      }
    }, [videoEl])



    return (
      <video
          height={height}
          width={width}
          controls={controls}
          ref={videoEl}
          muted={muted}
          playsInline
      />
    );
});

export default AmazonIvsReact;
