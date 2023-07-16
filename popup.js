document.getElementById("save-btn").addEventListener("click", function () {
  chrome.runtime.sendMessage({message: "save_tabs"});
});

document.getElementById("load-btn").addEventListener("click", function () {
  chrome.runtime.sendMessage({message: "load_tabs"});
});

window.addEventListener("DOMContentLoaded", (event) => {
  chrome.runtime.sendMessage({message: "get_status"}, function (response) {
    console.log(response.status);
  });
});
