import AmazonIvsReact from './amazon-ivs-react-player/index';
import {useState} from 'react';

function App() {

  const [player, setPlayer] = useState();
  const [playing, setPlaying] = useState(true);
  const [rate, setRate] = useState(1);
  const [url, setUrl] = useState("http://localhost:8080/hls/test.m3u8");

  return (
    <div>

      <button onClick={()=>setPlaying(!playing)}>Play/Pause</button>
      <button onClick={()=>setRate(1.5)}>rate 1.5x</button>
      <button onClick={()=>player.seekTo(0)}>seek To</button>

      <AmazonIvsReact
        width="100%"
        height="100%"
        ref={setPlayer}
        controls={true}
        url={url}
        playing={playing}
        playbackRate={rate}
        onProgress={(e) => console.log("progress", e)}
        onDuration={(e) => console.log("duration", e)}
        onEnded={(player) => player.seekTo(0)}
      />
    </div>
  );
}

export default App;
