<img src="https://github.com/daltonrowe/frameshifter/raw/master/public/welcome/frameshifter-readme.png">

# FrameShifter — Elite Dangerous Dashboards and Overlays

FrameShifter is a tool for displaying Elite Dangerous dashboards and overlays.

Extendable with HTML/CSS/JS, FrameShifter makes consuming data from status files and player journals easy.

FrameShifter works by hosting a local web server alongside the Elite Dangerous. This server reads your Elite Dangerous status files and player journal, and sends it to connected browser dashboards via websockets!

## Installing FrameShifter

- On the device where you play Elite Dangerous:

1. Download the lastest [FrameShifter zip file.](https://github.com/daltonrowe/frameshifter/raw/master/build/FrameShifter.zip)
1. Unzip and edit `config.json`.
   - Update `username`, `password`, and `journalDir` properties.
   - Be sure to include double slashes `\\` in the path name to escape the backslash character.
1. Double click `FrameShifter.exe`
   - Select "More Info"
   - Select "Run Anyway"
1. Done! Access FrameShifter in any browser window via the URLs printed in the terminal.

## Starting FrameShifter

1. Double click `FrameShifter.exe`
   - Select "More Info"
   - Select "Run Anyway"

## Connecting Devices

1. Connect to the same network/wifi where FrameShifter is running.
1. In a browser, visit the "Network" URL printed after starting FrameShifter
1. Done! **Any tablet, phone, monitor, or OBS browser source can display FrameShifter!**

- Use the "Local" URL printed in the terminal to access FrameShifter on the host computer.

## Configuration

User configuration is performed through the `config.json` in the root of the FrameShifter directory.

[Learn more about configuring FrameShifter here.](./README-config.md)

## Adding Plugins

[TODO: View a curated list of available plugins here.](./README-plugins-available.md)

1. Place the plugin folder and files in `public` directory
1. Edit `config.json`
   - In the `plugins` property array, add frame information as provided by the plugin creator.
1. Restart FrameShifter!

## Creating Plugins

Built with simple HTML + CSS + JS, FrameShifter aims to enable anyone familiar with web technologies (or not!) to easily and quickly make rad dashboards and overlays.

[Get started making plugins here.](./README-plugins.md)

## Documentation

[View JSDocs on Github Pages](https://daltonrowe.github.io/frameshifter/index.html)

## Credits & Acknowledgements

[View the awesome projects that made this possible](./README-acknowledgements.md)
