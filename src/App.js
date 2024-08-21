import "./App.css";
import mic_icon from "./assets/images/icons/mic.svg"
import leave_icon from "./assets/images/icons/leave.svg"

function App() {
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
