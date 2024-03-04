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
  let container = document.querySelector(".sidesheet-container");
  const isExpectLayout = container.children.length === 3;
  const initialized =
    isExpectLayout && container.children[1].style.position === "fixed";
  if (isCozeBotPage && !initialized) {
    return await sendMessage("shouldFreeCoze", {}, "background");
  }
};

const freeCoze = async () => {
  if (!(await shouldFreeCozeNow())) {
    return;
  }
  hideElements();
  replaceTitle();
  let container = document.querySelector(".sidesheet-container");
  document.documentElement.style.width = "100%";
  document.body.style.width = "100%";
  document.documentElement.style.minWidth = "100%";
  document.body.style.minWidth = "100%";
  container.children[0].style.display = "none";
  container.children[1].style.position = "fixed";
  container.children[1].style.zIndex = 1;
  container.children[1].style.left = "50%";
  container.children[1].style.height = "auto";
  container.children[1].style.transform = "translateX(-50%)";
  container.children[1].children[0].style.height = "52px";
  container.children[1].children[0].children[1].style.width = "auto";
  container.children[1].children[0].style.borderBottom = "none";
  container.children[1].children[1].style.display = "none";
  container.children[2].style.width = "100vw";
  return true;
};
