import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    version: "1.0.0",
    name: "X-Coze",
    description: "帮你一键美化 Coze，让 Bot 调试更丝滑。",
    permissions: ["tabs", "scripting"],
    host_permissions: ["*://*.coze.com/*", "*://*.coze.cn/*"],
  },
});
