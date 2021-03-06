/**
 * @namespace ClientUi
 */

/**
 * @function insertFrame
 * @param  {object} frame Plugin configuration object
 * @param  {HTMLElement} frameEl HTML markup to insert and eval
 * @description insert a frame (plugin) into the dashboard
 * @memberof ClientUi
 */
const insertFrame = async (frame, frameEl) => {
  if (frame.slug) frameEl.dataset.slug = frame.slug;

  const main = document.querySelector("#frame-window");
  main.appendChild(frameEl);

  if (frame.icon) {
    const iconEl = document.createElement("LI");
    iconEl.dataset.activateFrame = frameEl.id;
    if (frame.name) iconEl.dataset.name = frame.name;

    const iconImageEl = document.createElement("IMG");
    iconImageEl.src = frame.icon;
    iconImageEl.style.pointerEvents = "none";

    iconEl.appendChild(iconImageEl);
    const sidebar = document.querySelector("#sidebar");
    sidebar.appendChild(iconEl);
  }

  const scripts = frameEl.querySelectorAll("script");
  if (scripts)
    scripts.forEach(async (script) => {
      const scriptResponse = await fetch(script.src);
      const scriptText = await scriptResponse.text();

      console.log(`Executing script for frame "${frame.name}": ${script.src}`);
      try {
        eval(scriptText);
      } catch (err) {
        console.warn(`Error executing ${script.src}`);
        console.error(err);
      }
    });
};

/**
 * @function handleInternal
 * @param  {object} frame Plugin configuration object
 * @description fetch, insert, and eval plugin index.html from directory
 * @memberof ClientUi
 */
const handleInternal = async (frame) => {
  if (!frame.slug) {
    console.error(
      `Frame "${frame.name}" of type "interal" must have a "slug" property in config.json `
    );
    return;
  }

  const id = `frame-${frame.slug}-${Date.now()}`;

  const frameEl = document.createElement("SECTION");
  frameEl.dataset.activateAction = "defaultAction";
  frameEl.id = id;

  const frameResponse = await fetch(`/${frame.slug}/index.html`);
  const frameMarkup = await frameResponse.text();

  frameEl.innerHTML = frameMarkup;

  await insertFrame(frame, frameEl);
};

/**
 * @function handleIframe
 * @param  {object} frame Plugin configuration object
 * @description insert iframe plugin into dashboard, to be loaded on first click
 * @memberof ClientUi
 */
const handleIframe = async (frame) => {
  if (!frame.iframeUrl) {
    console.error(
      `Frame "${frame.name}" of type "iframe" must have an "iframeUrl" property in config.json `
    );
    return;
  }

  const id = `frame-iframe-${Date.now()}`;

  const frameEl = document.createElement("SECTION");
  frameEl.dataset.activateAction = "loadIframe";
  frameEl.dataset.iframeUrl = frame.iframeUrl;
  frameEl.id = id;

  await insertFrame(frame, frameEl);
};

/**
 * @function createUiEls
 * @description create basic ui elements for frameshifter dashboard
 * @memberof ClientUi
 */
const createUiEls = () => {
  const sidebar = document.createElement("UL");
  sidebar.id = "sidebar";
  document.body.appendChild(sidebar);

  const frameWindow = document.createElement("MAIN");
  frameWindow.id = "frame-window";
  document.body.appendChild(frameWindow);
};

/**
 * @function createFrames
 * @description loop over and insert frames for all relevant plugins
 * @memberof ClientUi
 */
const createFrames = async (frames) => {
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    switch (frame.type) {
      case "iframe":
        await handleIframe(frame);
        break;

      case "internal":
        await handleInternal(frame);
        break;

      case "standalone":
        // do nothing
        break;

      default:
        console.warn(
          `Frame type "${frame.type}" is not recognized for frame "${frame.name}" in config.json`
        );
        break;
    }
  }
};

/**
 * @function frameActivations
 * @description available actions when the plugin icon is selected
 * @memberof ClientUi
 */
const frameActivations = {
  loadIframe: (frameEl) => {
    if (frameEl.querySelector("iframe")) return;
    const iframe = document.createElement("IFRAME");
    iframe.src = frameEl.dataset.iframeUrl;

    frameEl.appendChild(iframe);
  },
  defaultAction: (_frameEl) => {
    // do nothing!
  },
};

/**
 * @function activateFrame
 * @param {HTMLElement} iconEl icon element to pull activation data from
 * @description swap frames in the dashboard ui
 * @memberof ClientUi
 */
const activateFrame = (iconEl) => {
  const currentFrame = document.querySelector("section.active");
  currentFrame && currentFrame.classList.remove("active");

  const nextFrame = document.querySelector(`#${iconEl.dataset.activateFrame}`);

  if (
    nextFrame.dataset.activateAction &&
    Object.keys(frameActivations).includes(nextFrame.dataset.activateAction)
  ) {
    frameActivations[nextFrame.dataset.activateAction](nextFrame);
  }

  const frameActivationEvent = new CustomEvent("ACTIVATE_FRAME", {
    detail: nextFrame.dataset.slug || false,
  });

  window.dispatchEvent(frameActivationEvent);

  nextFrame.classList.add("active");
};

/**
 * @function attachFrameActivation
 * @description attach event listeners to all icons after creation
 * @memberof ClientUi
 */
const attachFrameActivation = () => {
  const icons = document.querySelectorAll("#sidebar li");

  icons.forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const { target } = event;
      if (!target || !target.dataset.activateFrame) return;
      activateFrame(target);

      const activeIcon = document.querySelector("#sidebar li.active");
      activeIcon && activeIcon.classList.remove("active");

      target.classList.add("active");
    });
  });
};

/**
 * @function applyHueRotation
 * @param {number} hueRotate number of degrees to color rotate ui
 * @param {boolean} hueRotateIframes whether to reverse shift iframe elements to be colored normally
 * @description apply css property to support hue rotation
 * @memberof ClientUi
 */
const applyHueRotation = (hueRotate, hueRotateIframes) => {
  if (typeof hueRotate === undefined) return;

  const hueRotateStyle = document.createElement("STYLE");
  hueRotateStyle.innerHTML = `
    body {
      filter:hue-rotate(${hueRotate}deg);
    }

    body:not(.hue-rotate-iframes) iframe {
      filter:hue-rotate(-${hueRotate}deg);
    }
    `;
  document.head.appendChild(hueRotateStyle);

  if (hueRotateIframes) document.body.classList.add("hue-rotate-iframes");
};

/**
 * @function applyBackgroundImage
 * @param {string} backgroundImage absolute or relative url to dashboard background
 * @description set up the background img element
 * @memberof ClientUi
 */
const applyBackgroundImage = (backgroundImage) => {
  if (!backgroundImage) return;
  const bgImage = document.createElement("IMG");
  bgImage.id = "background-image";
  bgImage.src = backgroundImage;
  document.body.appendChild(bgImage);
};

/**
 * @function buildUi
 * @description bootstrap the dashboard ui from available config
 * @memberof ClientUi
 */
const buildUi = async () => {
  const { plugins, hueRotate, hueRotateIframes, backgroundImage } =
    window.frameShifterConfig;

  applyHueRotation(hueRotate, hueRotateIframes);
  applyBackgroundImage(backgroundImage);
  createUiEls();
  await createFrames(plugins);
  attachFrameActivation();

  // click first sidebar item
  document.querySelector("#sidebar li").click();
};

window.addEventListener("CONFIG_READY", buildUi);
