import "./App.css";
import mic_icon from "./assets/images/icons/mic-off.svg";
import leave_icon from "./assets/images/icons/leave.svg";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";

function App() {
  // rtc: Realtime communication
  // 1)local/publish--: If you want others in the session to hear what you're saying or see you, you need to "publish" your audio or video. Without publishing, it's like having your microphone or camera on but nobody can hear or see you.you can start, stop, mute, or adjust them as needed.

  // 2)remote/subscribe--: These are the audio tracks that you receive from other participants in the session. These tracks are played on your device so you can hear what others are saying. While you can mute or adjust the volume of remote audio tracks locally, you cannot control their transmission (i.e., you can't stop them from publishing)
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isRoomVisible, setIsRoomVisible] = useState(false);
  const [isRoomIdVisible, setIsRoomIdVisible] = useState(false);
  const [rtcClient, setRtcClient] = useState(null);
  const [audioTracks, setAudioTracks] = useState({
    localAudioTrack: null,
    remoteAudioTracks: {},
  });
  const [rtcUid, setRtcUid] = useState();
  const [membersJoined, setMembersJoined] = useState([]);
  console.log("membersJoined--", membersJoined);

  const appid = process.env.REACT_APP_APP_ID;
  const token = null;
  console.log("rtcUid--", rtcUid);
  let channelName = "main";
  // console.log("Local-audio Track", audioTracks.localAudioTrack);

  let initRtc = async () => {
    setRtcUid(Math.floor(Math.random() * 500)); //created user-id

    let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }); //creates client
    setRtcClient(client); //client val set into rtcClient state.
    // when value of RtcClient changes-> useEffect called and then tempFn called. I did this bcz state updates in React are asynchronous and sheduled so when rtcClient state changes its val from null to value useEffect is called follow up with initRtcFollowUp fn called.
    // I waited for the rtcClient state val to be changed from null,as the val of rtcClient is used in initRtcFollowUp fn to do some more operations.
  };

  const initRtcFollowUp = async () => {
    try {
      await rtcClient.join(appid, channelName, token, rtcUid);
      let lclAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      setAudioTracks((prev) => {
        return { ...prev, localAudioTrack: lclAudioTrack };
      });
      /*  
    you can perform operations with localAudioTrack in the same function right after setting it. Since state updates in React are asynchronous, it's safer to use the local variable (in this case, lclAudioTrack) directly within the same function. However, if you need to reference the state variable immediately after updating it within the same function, you can do so using the local variable or by accessing the state directly.
    */
      await rtcClient.publish(lclAudioTrack);
      setIsRoomVisible(true);
      setIsRoomIdVisible(true);
    } catch (e) {
      console.log("ERROR OCCURED", e);
    }
  };

  useEffect(() => {
    if (rtcClient != null) initRtcFollowUp();
  }, [rtcClient]);

  function joinMemberHandler(user) {
    console.log("userDetails--", user);
    setMembersJoined((prev) => {
      return [...prev, { id: user.uid }];
    });
  }
// LEFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT// START HERE
  async function publishMemberHandler(user, mediaType) {
    await rtcClient.subscribe(user, mediaType);
    
    if (mediaType === "audio") {
      setAudioTracks((prev) => {
        return { ...prev, remoteAudioTracks: {[user.uid]:user.audioTrack} };
      });
      // audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];
      // console.log("remoteAudioTracks--", audioTracks.remoteAudioTracks);

      user.audioTrack.play();
    }
  }
  // useEffect managing if any other user joins the channel
  useEffect(() => {
    if (rtcClient) {
      rtcClient.on("user-joined", joinMemberHandler);
      rtcClient.on("user-published", publishMemberHandler);
    }
  }, [rtcClient]);

  let leaveRoom = () => {
    // Read readme.md for better understanding
    audioTracks.localAudioTrack.stop();
    audioTracks.localAudioTrack.close();

    rtcClient.unpublish();
    rtcClient.leave();
    setIsRoomVisible(false);
    setIsRoomIdVisible(false);
    setIsFormVisible(true);
    setMembersJoined("");
  };

  return (
    <div id="container">
      <div
        id="room-header"
        style={{ display: isRoomVisible ? "flex" : "none" }}
      >
        <h1 id="room-name"></h1>

        <div id="room-header-controls">
          <img id="mic-icon" className="control-icon" src={mic_icon} />
          <img
            id="leave-icon"
            className="control-icon"
            src={leave_icon}
            onClick={leaveRoom}
          />
        </div>
      </div>

      <form
        id="form"
        onSubmit={(e) => {
          e.preventDefault();
          initRtc();
          setIsFormVisible(false);
        }}
        style={{ display: isFormVisible ? "block" : "none" }}
      >
        {/* <input name="displayname" type="text" placeholder="Enter display name..."/>  */}
        <input type="submit" value="Enter Room" />
      </form>
      <div id="members">
        <div
          className="speaker"
          style={{ display: isRoomIdVisible ? "block" : "none" }}
        >
          <p>{rtcUid}</p>
          <p>
            {audioTracks.localAudioTrack &&
              audioTracks.localAudioTrack.trackMediaType}
          </p>
        </div>
        {membersJoined &&
          membersJoined.map((member) => {
            return (
              <div
                className="speaker"
                style={{ display: isRoomIdVisible ? "block" : "none" }}
              >
                <p>{member.id}</p>
                <p>
                  {audioTracks.localAudioTrack &&
                    audioTracks.localAudioTrack.trackMediaType}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
