chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['isLocked'], function(data) {
                if (data.isLocked && details.url.includes('youtube.com')) {
                    resolve({ redirectUrl: chrome.runtime.getURL('blocked.html') });
                } else {
                    resolve({ cancel: false });
                }
            });
        });
    },
    { urls: ["*://*.youtube.com/*"] },
    ["blocking"]
); 