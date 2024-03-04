import "./style.css";
import cozeLogo from "@/assets/coze.svg";
import { setupSwitch } from "@/components/switch";
import { getCurrentTab } from "../background";
import { sendMessage } from "webext-bridge/popup";

export const callCurrentTab = async (
  command: string,
  payload: any = {}
): Promise<any> => {
  const tabId = await getCurrentTab();
  if (tabId) {
    return await sendMessage(command, payload, {
      tabId,
      context: "content-script",
    }).catch((e) => {
      console.error("callCurrentTab failed", command, payload, e);
    });
  }
};

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${cozeLogo}" class="logo vanilla" alt="Coze logo" />
    </a>
    <h1>Zen Mode</h1>
    <p class="read-the-docs">
    请先在<a href="https://coze.com" target="_blank"> Coze </a>官网创建你的 Bot
    <br/>
    然后打开 Bot 编辑页面开启「禅模式」
    </p>
    <div class="card">
      <label class="switch">
        <input type="checkbox" id="switch">
        <div class="slider round"></div>
      </label>
    </div>
    <p class="read-the-docs">
      Made with ❤️ by <a href="https://github.com/idootop/x-coze" target="_blank"> Del.Wang </a>
    </p>
  </div>
`;

setupSwitch(document.querySelector<HTMLButtonElement>("#switch")!);
