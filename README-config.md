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

### plugins

Array of plugins to use in the FrameShifter dashboard. For more information about entries here, see Plugin Configuration below.

### journalMaxLines

Maximum number of lines (events) to store from the player journal.

### journalCheckSecs

Number of seconds to wait between checking for new journal log files.

Elite Dangerous outputs different journal log files for each play session. FrameShifter detects these and automatically uses the newest journal log.

### journalFileRefreshSecs

Number of seconds between journal updates.

During development it was noticed that journal logs only update when read. FrameShifter checks the current journal file every `x` seconds, triggering new data and events.

### statusCheckSecs

Number of seconds between status file updates

Elite Dangerous outputs several JSON files with information about the player state. FrameShifter watches these files, checking every `x` seconds.

### serverPort

Server port to use for both web server and websockets.
Change this if you have conflicts with other ports.

### logging

`debug | warn | error | none`

Level of terminal logging you want to display in the FrameShifter terminal window.

### hueRotate

Colorize your dashboard just like your ship HUD. Number of degrees on the color wheel to rotate the FrameShifter dashboard.

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

### backgroundImage

Optional background image URL to use behind the FrameShifter dashboard.

---

## Frame Configuration

### name

Name of the plugin, used in icon tooltip and standalone URL output.

### desc

Description of the plugin, currently unused

### icon

Optional icon URL. If no URL is provided no icon will be generated in the dashboard.

### type

`internal | iframe | standalone`

When the FrameShifter dashboard loads, plugins with type `internal` are fetched and inserted using the `public/PLUGINSLUG/index.html` snippet. The directory used is determined by the plugin `slug` property.

```json
{
  "name": "Welcome Screen",
  "desc": "Initial about and splash screen",
  "icon": "/welcome/icon.svg",
  "type": "internal",
  "slug": "welcome"
}
```

Type `iframe` provides a simple and quick way to access embedded websites through FrameShifter. URLs are provided via the `iframeUrl` property.

```json
{
  "name": "Coriolis Shipyard",
  "desc": "Example iframe for Coriolis Shipyard app",
  "icon": "/icons/coriolis.svg",
  "type": "iframe",
  "iframeUrl": "https://coriolis.io/"
}
```

### slug

Directory in `public` folder to use for a plugins `index.html` file.

### iframeUrl

URL to embed in dashboard iframe.

### standaloneUrls

Array of relative URLs to print at start. Allow users to quickly access overlays and standalone files.
