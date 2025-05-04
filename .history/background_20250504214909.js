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

// Listen for tab updates and closures
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab && tab.url && tab.url.includes("youtube.com")) {
      chrome.storage.sync.set({ isLocked: true }, () => {
        updateRules(true);
      });
    }
  });
});

// Update blocking rules
function updateRules(isLocked) {
  const rules = [];

  if (isLocked) {
    rules.push({
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
    });
  }

  chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [1],
    addRules: rules,
  });
}
