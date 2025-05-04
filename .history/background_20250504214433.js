// Initialize rules
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["isLocked"], function (data) {
    updateRules(data.isLocked);
  });
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.isLocked) {
    updateRules(changes.isLocked.newValue);
  }
});

// Update blocking rules
function updateRules(isLocked) {
  if (isLocked) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              extensionPath: "/blocked.html",
            },
          },
          condition: {
            urlFilter: "youtube.com",
            resourceTypes: ["main_frame"],
          },
        },
      ],
      removeRuleIds: [1],
    });
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
    });
  }
}
