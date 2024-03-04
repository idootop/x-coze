import { sendMessage } from "webext-bridge/popup";

export async function setupSwitch(element: any) {
  const shouldFreeCoze = await sendMessage("shouldFreeCoze", "background");
  element.checked = shouldFreeCoze;
  element.addEventListener("click", async () => {
    const shouldFreeCoze = await sendMessage(
      "toggleShouldFreeCoze",
      "background"
    );
    element.checked = shouldFreeCoze;
  });
}
