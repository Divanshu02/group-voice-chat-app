import React from "react";

const MembersJoined = (props) => {
  const { membersJoined, audioTracks, speakingMembers, displayUserDetails } =
    props;
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
                    ? "green"
                    : "white",
                display: "flex",
              }}
            >
              <p>
                {displayUserDetails?.find((user) => user.id == member.id)?.name}
              </p>
              <p>
                {displayUserDetails?.find((user) => user.id == member.id)?.id}
              </p>
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
