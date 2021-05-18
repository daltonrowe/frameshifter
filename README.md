<img src="https://github.com/daltonrowe/frameshifter/raw/master/public/welcome/frameshifter-readme.png">


# FrameShifter — Elite Dangerous Dashboards and Overlays

FrameShifter is a tool for displaying Elite Dangerous dashboards and overlays. 

Extendable with HTML/CSS/JS, FrameShifter makes consuming data from status files and player journals easy.

FrameShifter works by hosting a local web server alongside the Elite Dangerous. This server reads your Elite Dangerous status files and player journal, and sends it to connected browser dashboards via websockets!

## Installing FrameShifter

* On the device where you play Elite Dangerous:
1. Download the lastest [FrameShifter zip file.](https://github.com/daltonrowe/frameshifter/archive/refs/heads/master.zip)
1. Unzip and edit `config.json`.
    - Update `username`, `password`, and `journalDir` properties.
    - Be sure to include double slashes `\\` in the path name to escape the backslash character.
1. Download and install [Node.js v14 or higher.](https://nodejs.org/en/download/current/)
1. Open PowerShell / terminal in FrameShifter directory.
1. Run `npm install` to install dependencies.
1. Run `npm start`.
1. Done! Access FrameShifter via the URLs printed in the terminal.

## Starting FrameShifter

1. After installing, run `npm start` from the FrameShifter root directory in a PowerShell or terminal.

## Connecting Devices

1. Connect to the same network/wifi where FrameShifter is running.
1. In a browser, visit the second URL printed after starting FrameShifter
1. Done! **Any tablet, phone, monitor, or OBS browser source can display FrameShifter!**

- Use the first URL (127.0.0.1:XXXX) to access FrameShifter on the host computer.

## Configuration

User configuration is performed through the `config.json` in the root of the FrameShifter directory.

[Learn more about configuring FrameShifter here.](./README-config.md)

## Adding Plugins

1. Place the plugin folder and files in `public` directory
1. Edit `config.json`
    - In the `frames` property array, add frame information as provided by the plugin creator.
1. Restart FrameShifter!

## Creating Plugins

Built with Node and vanilla JS, FrameShifter aims to enable anyone familiar with web technologies (or not!) to easily and quickly make rad dashboards and overlays.

[Get started making plugins here.](./README-plugins.md)