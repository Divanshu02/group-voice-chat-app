import React from "react";

const MembersJoined = (props) => {
  const { membersJoined, audioTracks, speakingMembers } = props;
  return (
    <>
      {membersJoined &&
        membersJoined.map((member, idx) => {
          return (
            <div
              className="speaker"
              key={idx}
              style={{
                borderColor:
                  speakingMembers &&
                  speakingMembers.length > 0 &&
                  speakingMembers.includes(member.id)
                    ? "red"
                    : "white",
                display: "flex",
              }}
            >
              <p>{member.id}</p>
              <p>
                {audioTracks.localAudioTrack &&
                  audioTracks.localAudioTrack.trackMediaType}
              </p>
            </div>
          );
        })}
    </>
  );
};

export default MembersJoined;
