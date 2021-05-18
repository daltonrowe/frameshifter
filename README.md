<div style="text-align:center;margin-bottom:20px;">
<img src="https://github.com/daltonrowe/frameshifter/raw/master/public/welcome/frameshifter-readme.png">
</div>

# FrameShifter

FrameShifter is an tool for displaying data from Elite Dangerous. Extendable with HTML/CSS/JS, FrameShifter makes consuming data from status files and player journals easy.

FrameShifter works by hosting a Node.js webserver on the host computer. This server reads your Elite Dangerous status files and player journal, and sends it to connected browsers via websockets!

## Installing FrameShifter

1. Download the lastest [FrameShifter .zip file.](https://github.com/daltonrowe/frameshifter/archive/refs/heads/master.zip)
1. Unzip and edit `config.json`.
    - Update `username`, `password`, and `journalDir` properties.
    - Be sure to include double slashes `\\` in the path name to escape the backslash character.
1. Download and install [Node.js v14 or higher.](https://nodejs.org/en/download/current/)
1. Open PowerShell / terminal in FrameShifter directory.
1. Run `npm install` to install dependencies.
1. Run `npm start`
1. Done! Access FrameShifter from the URLs printed in the terminal.

## Starting FrameShifter

1. After installing, run `npm start` from the FrameShifter root directory.

## Adding / Using Plugins

1. Place plugin files in `public/`
1. Edit `config.json`
1. In the `frames` property, add frame information as provided by the plugin creator.
1. In the `frames` property, add frame information as provided by the plugin creator.

## Making Plugins

Built with Node and vanilla JS, FrameShifter aims to enable anyone familiar with web technologies (or not!) to easily and quickly make rad dashboards and overlays.