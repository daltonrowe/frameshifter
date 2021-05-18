# FrameShifter plugins

FrameShifter is made to be easy, as such it has no build step. If you don't know what that means then you're in luck :). However this readme does assume some knowledge of HTML, CSS, and Javascript.

## Creating a dashboard plugin

**FrameShifter plugins are folders containing an `index.html` snippet.** 

When information is added to a user's `config.json` under the `frames` array, with type `internal`, the plugin is loaded into the FrameShifter Dashboard.

The `index.html` can load any arbitrary HTML markup, `<link>`s to CSS styles, or Javscript `<script>` tags needed to create your plugin.
Script tags are fetched and `eval`'d after insertion.

---

## Events

FrameShifter checks and consumes data from the a several Elite Dangerous files. Below are the files tracked and Javscript custom events fired on the `window`, when data is updated.

Learn more about information provided by Elite Dangerous status files and player journal [here.](https://elite-journal.readthedocs.io/en/latest/Status%20File/)

### Journal Events

---

## Examples
`config.json`
```json
"frames": [
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
<h1>My Cool Plugin</h1>
<div id="my-plugin-output"></div>

<link rel="stylesheet" href="/my-plugin/my-plugin-styles.css">

<script src="/my-plugin/my-plugin-script.js">
```

`public/my-plugin/my-plugin-script.js`
```js
const myPluginOut = document.querySelector("#my-plugin-output");

window.addEventListener("UPDATE_NAVROUTE", () => {
  myPluginOut.textContent = JSON.stringify(
    window.frameShifterState.navroute,
    null,
    2
  );
});
```

`public/my-plugin/my-plugin-styles.css`
```css
#my-plugin-output {
    height:100%;
    padding:20px 20px 0 20px;
    overflow-y: scroll;
}
```