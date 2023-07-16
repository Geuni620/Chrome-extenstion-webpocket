let tabStatus = "No tabs saved";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "save_tabs") {
    // 현재 창의 모든 탭을 가져옴
    chrome.tabs.query({currentWindow: true}, function (tabs) {
      let urls = tabs.map(function (tab) {
        return tab.url;
      });
      let obj = {};
      obj["savedTabs"] = urls;
      // 'savedTabs'라는 키를 사용해 저장
      chrome.storage.sync.set(obj, function () {
        if (chrome.runtime.lastError) {
          tabStatus = "Failed to save tabs";
        } else {
          // 탭들이 저장된 후에 현재 창을 닫음
          chrome.windows.getCurrent(function (window) {
            chrome.windows.remove(window.id);
            tabStatus = "Tabs saved";
          });
        }
      });
    });
    // 비동기 응답을 사용하므로 `true`를 반환해야 합니다.
    return true;
  } else if (request.message === "load_tabs") {
    // 'savedTabs'라는 키를 사용해 불러오기
    chrome.storage.sync.get("savedTabs", function (data) {
      let urls = data.savedTabs;
      if (urls && urls.length > 0) {
        urls.forEach(function (url) {
          chrome.tabs.create({url: url});
        });
        tabStatus = "Tabs loaded";
      } else {
        tabStatus = "No tabs to load";
      }
    });
    // 비동기 응답을 사용하므로 `true`를 반환해야 합니다.
    return true;
  } else if (request.message === "get_status") {
    sendResponse({status: tabStatus});
  }
});
