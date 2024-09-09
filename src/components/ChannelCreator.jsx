import React, { useEffect, useRef } from "react";

const ChannelCreator = (props) => {
  const { rtcUid, audioTracks, speakingMembers, displayUserDetails } = props;
  console.log("displayUserDetails--", displayUserDetails);
  return (
    <div
      className="speaker"
      style={{
        borderColor:
          speakingMembers &&
          speakingMembers.length > 0 &&
          speakingMembers.includes(rtcUid)
            ? "green"
            : "white",
      }}
    >
      <p>
        {
          displayUserDetails?.find((user) => {
            console.log("creatorDet--", user);
            return user.id == rtcUid;
          })?.name
        }
      </p>
      <p>
        {
          displayUserDetails?.find((user) => {
            console.log("creatorDet--", user);
            return user.id == rtcUid;
          })?.id
        }
      </p>
      <p>
        {audioTracks.localAudioTrack &&
          audioTracks.localAudioTrack.trackMediaType}
      </p>
    </div>
  );
};

export default ChannelCreator;
