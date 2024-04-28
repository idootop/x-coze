// @ts-nocheck

import { sendMessage } from "webext-bridge/content-script";

export default defineContentScript({
  matches: ["*://*.coze.com/*", "*://*.coze.cn/*"],
  main() {
    setInterval(freeCoze, 100);
  },
});

const hideElement = (query) => {
  const element = document.querySelector(query)?.children?.[0];
  if (element) {
    element.style.display = "none";
  }
};

const hideElements = () => {
  hideElement(".semi-spin-children"); // 菜单栏
  hideElement(".feelgood"); // 右下角反馈按钮
  hideElement(".bp5-overflow-list"); //右上角 tasks
};

const replaceTitle = () => {
  const replaceTextInNode = (node) => {
    if (node.innerText === "Preview") {
      node.innerHTML = `⚡️ Zen Mode`;
      return;
    } else if (node.innerText === "预览与调试") {
      node.innerHTML = "⚡️ 禅模式";
      return;
    } else {
      node.childNodes.forEach(replaceTextInNode);
    }
  };
  replaceTextInNode(document.body);
};

const shouldFreeCozeNow = async () => {
  const url = window.location.href;
  const regex = /space\/(\d+)\/bot\/(\d+)/;
  const isCozeBotPage = url.match(regex);
  let container = getContainer();
  const modelSelector = getModelSelector();
  if (!container || !modelSelector) {
    return false;
  }
  const isExpectLayout = container?.children?.length === 2;
  const initialized =
    isExpectLayout && modelSelector.style.position === "fixed";
  if (isCozeBotPage && !initialized) {
    return await sendMessage("shouldFreeCoze", {}, "background");
  }
};

const getContainer = () => {
  return document.querySelector(".sidesheet-container");
};

const getModelSelector = () => {
  return document.querySelector(
    'button[aria-haspopup="dialog"].semi-button-with-icon'
  );
};

const freeCoze = async () => {
  if (!(await shouldFreeCozeNow())) {
    return;
  }

  hideElements();
  replaceTitle();

  document.documentElement.style.width = "100%";
  document.body.style.width = "100%";
  document.documentElement.style.minWidth = "100%";
  document.body.style.minWidth = "100%";

  let container = getContainer();
  container.children[1].style.width = "100vw";
  container.children[1].children[0].style.boxShadow =
    "inset 0px -0.5px 0px rgba(0,0,0,20%)";

  const modelSelector = getModelSelector();
  modelSelector.style.position = "fixed";
  modelSelector.style.zIndex = 1;
  modelSelector.style.left = "50%";
  modelSelector.style.height = "auto";
  modelSelector.style.transform = "translateX(-50%)";
  modelSelector.style.background = "transparent";

  return true;
};
