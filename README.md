### Getting Started With Agora

Prerequisite's
- Have an account with agora.io
- Have an app ready: Ensure auth is set to APP ID only.

Install Agora RTC:

```
npm install agora-rtc-sdk-ng
```

**Configuring Agora RTC In Our App**

Inside `main.js` we will start by setting initial values for our app connection and RTC client.

1. Import the `AgoraRTC` class. This is the global entry point for all the methods provided by the Agora Web SDK. You can read more [here](https://api-ref.agora.io/en/voice-sdk/web/4.x/index.html#core-methods)
   
<br/>

2. Basic Credentials and user settings
   - `appid` - Your project app id from the agora console
   - `token` - Authentication token - Leave as `null` if you set the authentication mechanism to "APP ID only" when you created your app.
   - `rtcUid` - A user ID (UID) identifies a user in a channel. Each user in a channel should have a unique user ID. An RTC UID should be an integer (anything up to a 32 bit integer). In therory, this could be turned into a string but it is not recommended as it won't with certain agora products such as cloud recording. 
   - `roomId` - Agora requires a "channel name" for creating separate rooms users can join. We will use the name `roomId`, and just hard code this value as `main`. We will make this dynamic later so users can join different rooms.

<br/>

3. `audioTracks` will store our local tracks when we join a channel and all remote users who join later. Remote users will be stored as a key-value pair and will be identified by their unique id.

<br/>

4. `rtcClient` - Our client object which will be set once we initiate and join a channel. This will be our entry point to all the methods we need to join & leave rooms, toggle our mic, listen for key events, etc.

```js

**Initiate RTC Client & Join Channel**
```

The `initRtc` method will be responsible for the core configuration we need for joining a channel

1. Initiate client and join channel
    - `createClient` - initiates our RTC client and requires that we set the mode (live OR rtc) and encoding config
    - `join` - Creates or joins a room with our credentials (App ID, Room Name, token and user UID)

<br/>

2. Getting Mic Audio Tracks
   - `createMicrophoneAudioTrack` gets our local audio tracks which we will assign to the `localAudioTrack` key in our `audioTracks` object.

<br/>

3. Adding User To Dom - Create an HTML element and add it to dom with UID value. For now, this is the only thing we have to identify the user. We will add user names and avatars later.

4. -> local/publish--: Focuses on the channel side. with publish you’re sending your local audio track (microphone sound) to the Agora channel. Other participants can hear what you’re saying.. Without publishing, it's like having your microphone or camera on but nobody can hear or see you. You can start, stop, mute, or adjust them as needed.

-> unpublish(): Focuses on the channel side. It stops sending your audio to others in the channel but does not affect the local microphone’s ability to capture audio.

-> stop(): Focuses on the local side. It stops the microphone from capturing audio altogether, affecting local functionality.

-> close(): with close you’re completely shutting down and disposing of the microphone track. It stops capturing audio, and all resources associated with it are released. If you want to start speaking again, you’d need to create a new audio track. It removes microphone.

Ex- suppose we are on a zoom meeting and there is local mic on my pc and another option in the zoom meeting🎙️. Publish is like mic on your zoom-meet with which your voice reaches to the channel and all can hear you.
Unpublish is like muting your zoom-meet mic, so your voice 'll not able to reach to the channel and no-one can hear you.
Stop is like disabling your local mic.
close is like removing your local mic.
leave():(channel-side) Exit the group call, disconnecting from the channel and stopping all media streams.
with Subscribe remote users on the channel able to send their audio track to the current channel with which you are able to hear them.

-> remote/subscribe--: These are the audio tracks that you receive from other participants in the session. These tracks are played on your device so you can hear what others are saying. While you can mute or adjust the volume of remote audio tracks locally, you cannot control their transmission (i.e., you can't stop them from publishing)
Tracks refer to streams of data that carry either audio or video content.


```