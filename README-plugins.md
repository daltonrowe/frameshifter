# FrameShifter plugins

FrameShifter is made to be easy, as such it has no build step. If you don't know what that means then you're in luck :). However this readme does assume some knowledge of HTML, CSS, and Javascript.

## Creating a dashboard plugin

**FrameShifter plugins are folders containing an `index.html` snippet.** 

When information is added to a user's `config.json` under the `plugins` array, with type `internal`, the plugin is loaded into the FrameShifter Dashboard.

The `index.html` can load any arbitrary HTML markup, `<link>`s to CSS styles, or Javscript `<script>` tags needed to create your plugin.
Script tags are fetched and `eval`'d after insertion.

See the examples section below, or explore the packaged plugins to learn more.

---

## Available Data

Try using the built in dashboard plugin `Dev Scanner` to explore available data and behavior.

Learn more about information provided by Elite Dangerous status files and player journal [here.](https://elite-journal.readthedocs.io/en/latest/Status%20File/)

In Javascript the following data is available on the global `window` object.

### `window.frameShifterState`
- Contains all data currently(!) in the player's status files.

### `window.frameShifterJournal`
- Contains an array of the last 50 (by default) lines in the player's Journal .log file
- Default lines can be adjusted using the `journalMaxLines` property in `config.json`.

### `window.frameShifterConfig`
- Contains all the information in the user config file, expect `username`, `password` and `journalDir`.

---

## Events

FrameShifter checks and consumes data from the a several Elite Dangerous files. Below are the files tracked and Javscript custom events fired on the `window`, when data is updated.

Learn more about information provided by Elite Dangerous status files and player journal [here.](https://elite-journal.readthedocs.io/en/latest/Status%20File/)

### Journal Events

TODO

### Status Events

TODO

---

## Examples

Below are the files and config updates require to make player Nav Route data appear on screen.

`config.json`
```json
"plugins": [
    {
        "name": "My New Plugin",
        "desc": "Displays nav route JSON when plotted in the galaxy map.",
        "icon": "/my-plugin/icon.svg",
        "type": "internal",
        "slug": "my-plugin"
    }
],
```

`public/my-plugin/index.html`
```html
<h1>My New Plugin</h1>
<div id="my-plugin-output"></div>

<link rel="stylesheet" href="/my-plugin/my-plugin-styles.css">

<script src="/my-plugin/my-plugin-script.js">
```

`public/my-plugin/my-plugin-script.js`
```js
// find our plugin's element
const myPluginOut = document.querySelector("#my-plugin-output");

// when nav route data updates
window.addEventListener("UPDATE_NAVROUTE", () => {
  
  // set the output elements text content the current FrameShifter data.
  myPluginOut.textContent = JSON.stringify(
    window.frameShifterState.navroute,
    null,
    2
  );
});
```

`public/my-plugin/my-plugin-styles.css`
```css
/* basic dashboard padding */
#my-plugin-output {
    height:100%;
    padding:20px 20px 0 20px;
    overflow-y: scroll;
}
```