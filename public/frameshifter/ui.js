const insertFrame = async (frame, frameEl) => {
  const main = document.querySelector("#frame-window");
  main.appendChild(frameEl);

  if (frame.icon) {
    const iconEl = document.createElement("LI");
    iconEl.dataset.activateFrame = frameEl.id;

    const iconImageEl = document.createElement("IMG");
    iconImageEl.src = frame.icon;
    iconImageEl.style.pointerEvents = "none";

    iconEl.appendChild(iconImageEl);
    const sidebar = document.querySelector("#sidebar");
    console.log("append icon", iconEl);
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
        console.error(error);
      }
    });
};

const handleInternal = async (frame) => {
  if (!frame.slug) {
    console.error(
      `Frame "${frame.name}" of type "interal" must have a "slug" property in config.json `
    );
    return;
  }

  const id = `frame-iframe-${Date.now()}`;

  const frameEl = document.createElement("SECTION");
  frameEl.dataset.activateAction = "defaultAction";
  frameEl.id = id;

  const frameResponse = await fetch(`/${frame.slug}/index.html`);
  const frameMarkup = await frameResponse.text();

  frameEl.innerHTML = frameMarkup;

  await insertFrame(frame, frameEl);
};

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

const createUiEls = () => {
  const sidebar = document.createElement("UL");
  sidebar.id = "sidebar";
  document.body.appendChild(sidebar);

  const frameWindow = document.createElement("MAIN");
  frameWindow.id = "frame-window";
  document.body.appendChild(frameWindow);
};

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

      default:
        console.warn(
          `Frame type "${frame.type}" is not recognized for frame "${frame.name}" in config.json`
        );
        break;
    }
  }
};

const frameActivations = {
  loadIframe: (frameEl) => {
    const iframe = document.createElement("IFRAME");
    iframe.src = frameEl.dataset.iframeUrl;

    frameEl.appendChild(iframe);
  },
  defaultAction: (_frameEl) => {
    console.log("do it!");
    // do nothing!
  },
};

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
    detail: nextFrame.id,
  });

  window.dispatchEvent(frameActivationEvent);

  nextFrame.classList.add("active");
};

const attachFrameActivation = () => {
  const icons = document.querySelectorAll("#sidebar li");

  icons.forEach((icon) => {
    console.log("attaching", icon);

    icon.addEventListener("click", (event) => {
      const { target } = event;
      if (!target || !target.dataset.activateFrame) return;
      activateFrame(target);
    });
  });
};

const buildUi = async () => {
  const { frames } = window.frameShifterConfig;

  createUiEls();
  await createFrames(frames);
  attachFrameActivation();
};

window.addEventListener("CONFIG_READY", buildUi);
