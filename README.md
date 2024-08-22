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

4. local/publish--: If you want others in the session to hear what you're saying or see you, you need to "publish" your audio or video. Without publishing, it's like having your microphone or camera on but nobody can hear or see you.you can start, stop, mute, or adjust them as needed.

remote/subscribe--: These are the audio tracks that you receive from other participants in the session. These tracks are played on your device so you can hear what others are saying. While you can mute or adjust the volume of remote audio tracks locally, you cannot control their transmission (i.e., you can't stop them from publishing)
Tracks refer to streams of data that carry either audio or video content
```