chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "save_and_close_tabs") {
    saveAndCloseTabs();
    sendResponse({status: "Tabs saved and closed"});
  } else if (request.message === "load_tabs") {
    loadTabs();
    sendResponse({status: "Tabs loaded"});
  }
});

function saveAndCloseTabs() {
  chrome.tabs.query({}, function (tabs) {
    var tabURLs = tabs
      .map((tab) => tab.url)
      .filter((url) => !url.startsWith("chrome://"));

    // URL 저장
    chrome.storage.local.set({savedURLs: tabURLs}, function () {
      console.log("URLs 저장 완료");
    });

    // 탭 닫기
    tabs.forEach((tab) => {
      if (!tab.url.startsWith("chrome://")) {
        chrome.tabs.remove(tab.id);
      }
    });
  });
}

function loadTabs() {
  chrome.storage.local.get("savedURLs", function (data) {
    var savedURLs = data.savedURLs;
    if (savedURLs) {
      savedURLs.forEach((url) => chrome.tabs.create({url: url}));
    }
  });
}
