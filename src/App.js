import "./App.css";
import mic_icon from "./assets/images/icons/mic.svg";
import leave_icon from "./assets/images/icons/leave.svg";
import AgoraRTC from "agora-rtc-sdk-ng";

function App() {
  // rtc: Realtime communication
  // 1)local/publish--: If you want others in the session to hear what you're saying or see you, you need to "publish" your audio or video. Without publishing, it's like having your microphone or camera on but nobody can hear or see you.you can start, stop, mute, or adjust them as needed.

  // 2)remote/subscribe--: These are the audio tracks that you receive from other participants in the session. These tracks are played on your device so you can hear what others are saying. While you can mute or adjust the volume of remote audio tracks locally, you cannot control their transmission (i.e., you can't stop them from publishing)
  const appid = "cfa6b5f61fb84df89aa95c907b68b064";
  const token = null;
  const rtcUid = Math.floor(Math.random() * 2032);
  let channelName = "main";
  let audioTracks = {
    localAudioTrack: null,
    remoteAudioTracks: {},
  };

  let rtcClient;

  let initRtc = async () => {
    rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    await rtcClient.join(appid, channelName, token, rtcUid);
    audioTracks.localAudioTrack = AgoraRTC.createMicrophoneAudioTrack();
    rtcClient.publish(audioTracks.localAudioTrack);
  };
  return (
    <div id="container">
      <div id="room-header">
        <h1 id="room-name"></h1>

        <div id="room-header-controls">
          <img id="mic-icon" class="control-icon" src={mic_icon} />
          <img id="leave-icon" class="control-icon" src={leave_icon} />
        </div>
      </div>

      <form id="form">
        {/* <input name="displayname" type="text" placeholder="Enter display name..."/>  */}
        <input type="submit" value="Enter Room" />
      </form>

      <div id="members"></div>
    </div>
  );
}

export default App;
