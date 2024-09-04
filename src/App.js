import "./App.css";
import mute_icon from "./assets/images/icons/mic-off.svg";
import unmute_icon from "./assets/images/icons/mic.svg";
import leave_icon from "./assets/images/icons/leave.svg";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import MembersJoined from "./components/MembersJoined";
import ChannelCreator from "./components/ChannelCreator";
import AgoraRTM from "agora-rtm-sdk";

function App() {
  // rtc: Realtime communication
  // 1)local/publish--: If you want others in the session to hear what you're saying or see you, you need to "publish" your audio or video. Without publishing, it's like having your microphone or camera on but nobody can hear or see you.you can start, stop, mute, or adjust them as needed.

  // 2)remote/subscribe--: These are the audio tracks that you receive from other participants in the session. These tracks are played on your device so you can hear what others are saying. While you can mute or adjust the volume of remote audio tracks locally, you cannot control their transmission (i.e., you can't stop them from publishing)
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isRoomVisible, setIsRoomVisible] = useState(false);
  const [isTotalMembersVisible, setIsTotalMembersVisible] = useState(false);
  const [rtcClient, setRtcClient] = useState(null);
  const [rtcUid, setRtcUid] = useState();
  const [isMute, setIsMute] = useState(true);
  const [audioTracks, setAudioTracks] = useState({
    localAudioTrack: null,
    remoteAudioTracks: {},
  });

  const [userName, setUserName] = useState("");
  const [membersJoined, setMembersJoined] = useState([]);
  const [speakingMembers, setSpeakingMembers] = useState();
  const appid = process.env.REACT_APP_APP_ID;
  const token = null;
  let channelName = "main";

  // const signalingEngine = new AgoraRTM.RTM(appid, "user-id", {
  //   token: token,
  // });

  let initRTM = async () => {
    const signalingEngine = new AgoraRTM.RTM(appid, channelName, {
      token: token,
    });

    // Listen for events
    signalingEngine.addEventListener("message", (eventArgs) => {
      console.log(`${eventArgs.publisher}: ${eventArgs.message}`);
    });
    // signalingEngine.on("member-joined",(user)=>{
    //   console.log("mem",user)
    // })

    // Login
    try {
      await signalingEngine.login();
    } catch (err) {
      console.log({ err }, "error occurs at login.");
    }

    // Send channel message
    try {
      await signalingEngine.publish("channel", "hello world");
    } catch (err) {
      console.log({ err }, "error occurs at publish message");
    }
  };
  let initRtc = () => {
    setRtcUid(Math.floor(Math.random() * 2000)); //created user-id

    let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }); //creates client
    setRtcClient(client); //client val set into rtcClient state.
    // when value of RtcClient changes-> useEffect called and then tempFn called. I did this bcz state updates in React are asynchronous and sheduled so when rtcClient state changes its val from null to value useEffect is called follow up with initRtcFollowUp fn called.
    // I waited for the rtcClient state val to be changed from null,as the val of rtcClient is used in initRtcFollowUp fn to do some more operations.
  };

  useEffect(() => {
    if (rtcClient != null) initRtcFollowUp();
  }, [rtcClient]);

  const initRtcFollowUp = async () => {
    try {
      await rtcClient.join(appid, channelName, token, rtcUid);
      let lclAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setIsMute(true);
      setAudioTracks((prev) => {
        return { ...prev, localAudioTrack: lclAudioTrack };
      });
      /*  
    you can perform operations with localAudioTrack in the same function right after setting it. Since state updates in React are asynchronous, it's safer to use the local variable (in this case, lclAudioTrack) directly within the same function. However, if you need to reference the state variable immediately after updating it within the same function, you can do so using the local variable or by accessing the state directly.
    */
      initVolumeIndicator();
      setIsRoomVisible(true);
      setIsTotalMembersVisible(true);
    } catch (e) {
      console.log("ERROR OCCURED", e);
    }
  };

  function initVolumeIndicator() {
    AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
    rtcClient.enableAudioVolumeIndicator();
  }

  function joinMemberHandler(user) {
    console.log("userDetails--", user);
    setMembersJoined((prev) => {
      for (let member of prev) {
        if (member && member.id == user.uid) {
          return [...prev];
        }
      }
      return [...prev, { id: user.uid }];
    });
  }

  function userLeftHandler(user) {
    setMembersJoined((prev) => {
      let members = prev.filter((member) => {
        return member.id != user.uid;
      });
      return members;
    });
    setAudioTracks((prev) => {
      const updatedRemoteAudioTracks = { ...prev.remoteAudioTracks };
      Object.keys(updatedRemoteAudioTracks).forEach((key) => {
        if (key == user.uid) {
          delete updatedRemoteAudioTracks[key];
        }
      });
      return {
        ...prev,
        remoteAudioTracks: updatedRemoteAudioTracks,
      };
    });
  }

  async function publishMemberHandler(user, mediaType) {
    await rtcClient.subscribe(user, mediaType);

    if (mediaType === "audio") {
      setAudioTracks((prev) => {
        return {
          ...prev,
          remoteAudioTracks: {
            ...prev.remoteAudioTracks,
            [user.uid]: [user.audioTrack],
          },
        };
      });
      // audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];
      user.audioTrack.play();
    }
  }
  // useEffect managing if any other user joins the channel
  useEffect(() => {
    if (rtcClient) {
      rtcClient.on("user-joined", joinMemberHandler);
      rtcClient.on("user-left", userLeftHandler);
      rtcClient.on("user-published", publishMemberHandler);
      rtcClient.on("volume-indicator", (volume) => {
        console.log("volumes--", volume);
        const activeSpeakers = volume
          .filter((vol) => {
            if (vol.level > 50) return vol;
          })
          .map((vol) => vol.uid);
        setSpeakingMembers(activeSpeakers);

        // console.log("activeSpeakers--",activeSpeakers)
      });
    }
  }, [rtcClient]);

  let leaveRoom = () => {
    // Read readme.md for better understanding
    audioTracks.localAudioTrack.stop();
    audioTracks.localAudioTrack.close();

    rtcClient.unpublish();
    rtcClient.leave();
    setIsRoomVisible(false);
    setIsTotalMembersVisible(false);
    setIsFormVisible(true);
  };

  // effect managing the mic-mute-unmute functionality
  useEffect(() => {
    if (rtcClient) micMuteUnmuteHandler();
  }, [isMute]);

  async function micMuteUnmuteHandler() {
    if (isMute) {
      await rtcClient.unpublish(audioTracks.localAudioTrack);
    } else {
      await rtcClient.publish(audioTracks.localAudioTrack);
    }
  }

  return (
    <div id="container">
      {/* Room-Header */}
      <div
        id="room-header"
        style={{ display: isRoomVisible ? "flex" : "none" }}
      >
        <h1 id="room-name"></h1>

        <div id="room-header-controls">
          <img
            id="mic-icon"
            className="control-icon"
            src={isMute ? mute_icon : unmute_icon}
            onClick={() => setIsMute((prev) => !prev)}
            alt="mic-icon"
          />
          <img
            id="leave-icon"
            className="control-icon"
            src={leave_icon}
            onClick={leaveRoom}
            alt="leave-icon"
          />
        </div>
      </div>

      <form
        id="form"
        onSubmit={(e) => {
          e.preventDefault();
          initRtc();
          // initRTM();
          setIsFormVisible(false);
        }}
        style={{ display: isFormVisible ? "block" : "none" }}
      >
        <input
          type="text"
          name="displayName"
          placeholder="Enter Display Name"
          id=""
          onChange={(e) => setUserName(e.target.value)}
        />
        <input type="submit" value="Enter Room" />
      </form>
      <div
        id="members"
        style={{ display: isTotalMembersVisible ? "flex" : "none" }}
      >
        <ChannelCreator
          isTotalMembersVisible={isTotalMembersVisible}
          rtcUid={rtcUid}
          audioTracks={audioTracks}
          rtcClient={rtcClient}
          speakingMembers={speakingMembers}
        />
        <MembersJoined
          membersJoined={membersJoined}
          audioTracks={audioTracks}
          isTotalMembersVisible={isTotalMembersVisible}
          rtcClient={rtcClient}
          speakingMembers={speakingMembers}
        />
      </div>
    </div>
  );
}

export default App;
