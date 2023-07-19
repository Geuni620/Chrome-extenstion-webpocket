chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "save_tabs") {
    chrome.tabs.query({currentWindow: true}, function (tabs) {
      let urls = tabs.map((tab) => tab.url);
      // `request.title`을 키로 사용하여 탭 URL을 저장합니다.
      chrome.storage.sync.set({[request.title]: urls}, function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          chrome.windows.getCurrent(function (window) {
            chrome.windows.remove(window.id);
          });
        }
      });
    });
    return true;
  } else if (request.message === "load_tabs") {
    // `request.title`을 키로 사용하여 탭 URL을 불러옵니다.
    chrome.storage.sync.get(request.title, function (data) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        let urls = data[request.title];
        urls.forEach((url) => chrome.tabs.create({url}));
      }
    });
    return true;
  }

  //
  if (request.message === "reset_tabs") {
    chrome.storage.sync.clear(function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        sendResponse({message: "reset_successful"});
      }
    });
    return true;
  }
});
