document.getElementById("save-btn").addEventListener("click", function () {
  chrome.runtime.sendMessage(
    {message: "save_and_close_tabs"},
    function (response) {
      console.log(response);
    }
  );
});

document.getElementById("load-btn").addEventListener("click", function () {
  chrome.runtime.sendMessage({message: "load_tabs"}, function (response) {
    console.log(response);
  });
});
