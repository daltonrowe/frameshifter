# FrameShifter plugins

FrameShifter is made to be easy, as such it has no build step. If you don't know what that means then you're in luck :). However this readme does assume some knowledge of HTML, CSS, and Javascript.

[View JSDocs on Github Pages](https://daltonrowe.github.io/frameshifter/index.html)

## Creating a dashboard plugin

**FrameShifter plugins are folders containing an `index.html` snippet.**

When information is added to a user's `config.json` under the `plugins` array, with type `internal`, the plugin is loaded into the FrameShifter Dashboard.

The `index.html` can load any arbitrary HTML markup, `<link>`s to CSS styles, or Javscript `<script>` tags needed to create your plugin.
Script tags are fetched and `eval`'d after insertion.

See the examples section below, or explore the packaged plugins to learn more.

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

<div id="my-plugin-wrapper" class="frame-default">

  <h1>My New Plugin</h1>
  <div id="my-plugin-output"></div>

</div>

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
#my-plugin-wrapper {
  background: blue;
}
```

---

## Helpers

FrameShifter provides several helper functions to make development of dashboards easier.

Most notable is the function `window.frameShifterHelpers.playerInfo('some-info-type')`. This provides normalized data from all parts of FrameShifter.

`playerInfo()` will return the value if the request data is present, and `null` if not currently available.

A full list of player info types, see the `status-panel` plugin for examples:

- `docked`
- `landed`
- `landing-gear`
- `shields-up`
- `supercruise`
- `fa-off`
- `hardpoints`
- `in-wing`
- `external-lights`
- `cargo-scoop`
- `silent-running`
- `scooping-fuel`
- `srv-handbrake`
- `srv-turret`
- `srv-turret-retracted`
- `srv-drive-assist`
- `mass-locked`
- `fsd-charging`
- `fsd-cooldown`
- `low-fuel`
- `overheat`
- `has-lat-lng`
- `danger`
- `interdicted`
- `in-ship`
- `in-fighter`
- `in-srv`
- `analysis-mode`
- `night-vision`
- `has-altitude`
- `fsd-jump`
- `srv-highbeam`
- `cargo-weight`
- `firegroup`
- `legal-state`
- `fuel-main`
- `fuel-res`
- `pips-sys`
- `pips-eng`
- `pips-wep`
- `on-foot`
- `in-taxi`
- `multicrew`
- `on-foot-in-station`
- `on-foot-on-planet`
- `aim-down-sight`
- `low-o2`
- `low-health`
- `cold`
- `hot`
- `very-cold`
- `very-hot`
- `glide`
- `on-foot-in-hangar`
- `on-foot-in-social`
- `on-foot-exterior`
- `breathable-atom`
- `ship`
- `ship-ident`
- `ship-name`
- `hull-perc`
- `hull-value`
- `unladen-mass`
- `fuel-main-cap`
- `fuel-res-cap`
- `cargo-cap`
- `max-jump`
- `rebuy`
- `cmdr-name`
- `horizons`
- `odyssey`
- `game-mode`
- `credits-at-load`
- `fuel-main-perc`
- `fuel-res-perc`
- `cargo-perc`

---

## Events

FrameShifter checks and consumes data from the a several Elite Dangerous files. Below are the files tracked and Javscript custom events fired on the `window`, when data is updated.

Learn more about information provided by Elite Dangerous status files and player journal [here.](https://elite-journal.readthedocs.io/en/latest/Status%20File/)

### Journal Events

Journal events from client.js can be consumed with `eventListeners` on the `window`

```js
window.addEventListener("JOURNAL_SOMEVENTNAME", (event) => {
  const { detail } = event;
  // do something with journal entry data in `detail`
});
```

These events are are all UPPERCASE, and contain a wide variety of data available from Elite.

For a full list of journal events, see [EDCodex Docs](http://edcodex.info/?m=doc).

Some common example events might be:

- `JOURNAL_FSDJUMP`
- `JOURNAL_DIED`
- `JOURNAL_PVPKILL`
- `JOURNAL_LIFTOFF`
- `JOURNAL_SELLEXPLORATIONDATA`

Journal events for `LOADGAME` and `LOADOUT` are special in that the most recent version is stored in `window.frameShifterState.loadgame` and `window.frameShifterState.loadout` respectively.

### Update Events

Update events from client.js can be consumed with `eventListeners` on the `window`

```js
window.addEventListener("UPDATE_SOMENAME", (event) => {
  const { detail } = event;
  // do something with update info data in `detail`
});
```

These events are are all UPPERCASE, and contain a wide variety of data available from Elite.

Full list of update events:

- `UPDATE_STATUS`
- `UPDATE_MARKET`
- `UPDATE_SHIPYARD`
- `UPDATE_OUTFITTING`
- `UPDATE_CARGO`
- `UPDATE_MODULESINFO`
- `UPDATE_NAVROUTE`
- `UPDATE_BACKPACK`
- `UPDATE_JOURNAL`

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
