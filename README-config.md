# FrameShifter configuration

FrameShifter has a number of options, details about what these all do are below.

### username

FrameShifter uses BasicAuth to provide some measure of access control. This value will be the username accepted when accessing the dashboard.

### password

The password accepted when accessing the dashboard.

### journalDir

Path to Elite Dangerous journal logs and status files.
For Windows users this should be:

```json
"journalDir": "C:\\Users\\YOURWINDOWSUSER\\Saved Games\\Frontier Developments\\Elite Dangerous",
```

Note the double backslashes! In JSON / Javascript `\` is a special character and must be escaped... to accomplish this we add another `\`.

### frames

Array of plugins to use in the FrameShifter dashboard. For more information about entries here, see Frame Configuration below.

### journalMaxLines

Maximum number of lines (events) to store from the player journal. 

### `journalCheckMins`

Number of minutes to wait between checking for new journal log files. 

Elite Dangerous outputs different journal log files for each play session. FrameShifter detects these and automatically uses the newest journal log.

### journalFileRefreshSecs

Number of seconds between journal updates.

During development it was noticed that journal logs only update when read. FrameShifter checks the current journal file every `x` seconds, triggering new data and events.

### statusCheckSecs

Number of seconds between status file updates

Elite Dangerous outputs several JSON files with information about the player state.  FrameShifter watches these files, checking every `x` seconds.

### serverPort

Server port to use for both web server and websockets.
Change this if you have conflicts with other ports.

### logging

`debug | warn | error | none`

Level of terminal logging you want to display.

### hueRotate

Colorize your dashboard just like your ship HUD. Number of degrees to rotate the FrameShifter dashboard.

- `0` - Elite Dangerous Orange
- `60` - Green
- `120` - Teal
- `180` - Blue
- `230` - Purple
- `320` - Light Red

For more advanced themeing, you edit the variables at the top of `public/edcss/edcss.css`.

### hueRotateIframes

`true | false`

Whether to colorize embedded iFrames or leave as is. Kind of neat for Elite themed sites like Coriolis, but generally probably annoying.

## backgroundImage

Optional background image URL to use behind the FrameShifter dashboard.

---

## Frame Configuration

### name
Name of the plugin, currently unused

### desc
Description of the plugin, currently unused

### icon
Optional icon URL. If no URL is provided no icon will be generated in the dashboard.

### type
`internal | iframe`

On dashboard load plugins with type `internal` are loaded via `public/PLUGINSLUG/index.html` snippet. Directory used is determined by the plugin `slug` property.

Type `iframe` provides a simple and quick way to access embedded websites through FrameShifter. URLs are provided via the `iframeUrl` property.

### slug

Directory in `public` folder to use for a plugins `index.html` file.

### iframeUrl

URL to embed in dashboard iframe.

### standaloneUrl

Plugins that use stand alone HTML files can tell FrameShifter about them and print them for users by providing a relative URL here.

