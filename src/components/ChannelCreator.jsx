import React, { useEffect, useRef } from "react";

const ChannelCreator = (props) => {
  const { rtcUid, audioTracks, speakingMembers } = props;

  return (
    <div
      className="speaker"
      style={{
        borderColor:
          speakingMembers &&
          speakingMembers.length > 0 &&
          speakingMembers.includes(rtcUid)
            ? "red"
            : "white",
      }}
    >
      <p>{rtcUid}</p>
      <p>
        {audioTracks.localAudioTrack &&
          audioTracks.localAudioTrack.trackMediaType}
      </p>
    </div>
  );
};

export default ChannelCreator;
