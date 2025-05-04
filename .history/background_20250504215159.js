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

// Track YouTube tabs
let youtubeTabs = new Set();

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes('youtube.com')) {
    if (changeInfo.status === 'complete') {
      youtubeTabs.add(tabId);
    }
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  if (youtubeTabs.has(tabId)) {
    youtubeTabs.delete(tabId);
    // If no YouTube tabs are open, enable the lock
    if (youtubeTabs.size === 0) {
      chrome.storage.sync.set({ isLocked: true }, () => {
        updateRules(true);
      });
    }
  }
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
