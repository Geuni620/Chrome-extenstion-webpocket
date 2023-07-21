document.getElementById("reset-btn").addEventListener("click", function () {
  if (
    confirm(
      "Are you sure you want to delete all saved tab groups? This cannot be undone."
    )
  ) {
    chrome.runtime.sendMessage({message: "reset_tabs"}, function (response) {
      if (response.message === "reset_successful") {
        let groups = document.getElementById("groups");
        while (groups.firstChild) {
          groups.firstChild.remove();
        }
        loadGroups();
      }
    });
  }
});

document.getElementById("save-btn").addEventListener("click", function () {
  let title = prompt("Enter a title for this tab group:");
  if (title) {
    chrome.runtime.sendMessage(
      {message: "save_tabs", title: title},
      function () {
        let btn = document.createElement("button");
        btn.textContent = title;
        btn.addEventListener("click", function () {
          chrome.runtime.sendMessage({message: "load_tabs", title: title});
        });
        document.getElementById("groups").appendChild(btn);
      }
    );
  }
});

function loadGroups() {
  chrome.storage.sync.get(null, function (data) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      for (let title in data) {
        let div = document.createElement("div");

        let btn = document.createElement("button");
        btn.textContent = title;
        btn.addEventListener("click", function () {
          chrome.runtime.sendMessage({message: "load_tabs", title: title});
        });
        div.appendChild(btn);

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", function () {
          if (confirm("Are you sure you want to delete this tab group?")) {
            chrome.runtime.sendMessage(
              {message: "delete_group", title: title},
              function (response) {
                if (response.message === "delete_successful") {
                  div.remove();
                }
              }
            );
          }
        });
        div.appendChild(deleteBtn);

        document.getElementById("groups").appendChild(div);
      }
    }
  });
}

window.addEventListener("DOMContentLoaded", loadGroups);
