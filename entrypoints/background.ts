import { onMessage } from "webext-bridge/background";

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
  let shouldFreeCoze = false;
  onMessage("toggleShouldFreeCoze", async () => {
    shouldFreeCoze = !shouldFreeCoze;
    console.log("shouldFreeCoze", shouldFreeCoze);
    return shouldFreeCoze;
  });
  onMessage("shouldFreeCoze", async () => {
    return shouldFreeCoze;
  });
});
