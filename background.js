// background.js

let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

chrome.commands.onCommand.addListener((shortcut) => {
  console.log("lets reload");
  console.log(shortcut);
  if (shortcut.includes("+M")) {
    chrome.runtime.reload();
  }
  chrome.commands.href =
    "chrome-extension://pjaojblbbbegmbaldodancolnhkolopc/options.html";
});
