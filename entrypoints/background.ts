import { onMessage } from "webext-bridge/background";
import { storage } from "wxt/storage";

export const getCurrentTab = async () => {
  const tabs = await browser.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .catch((e) => console.error(e));
  return tabs[0]?.id;
};

export default defineBackground(() => {
  onMessage("toggleShouldFreeCoze", async () => {
    const shouldFreeCoze = await storage.getItem("local:shouldFreeCoze", {
      defaultValue: false,
    });
    await storage.setItem("local:shouldFreeCoze", !shouldFreeCoze);
    return !shouldFreeCoze;
  });
  onMessage("shouldFreeCoze", async () => {
    return await storage.getItem("local:shouldFreeCoze", {
      defaultValue: false,
    });
  });
});
