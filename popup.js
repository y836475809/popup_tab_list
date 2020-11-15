function firstUnpinnedTab(tabs) {
    for (var tab of tabs) {
        if (!tab.pinned) {
            return tab.index;
        }
    }
}

/**
    * listTabs to switch to
    */
function listTabs() {
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = document.getElementById('tabs-list');
        let currentTabs = document.createDocumentFragment();
        let limit = 50;
        let counter = 0;

        tabsList.textContent = '';

        for (let tab of tabs) {
            if (!tab.active && counter <= limit) {
                let parent = document.createElement("div");
                parent.classList.add('switch-tabs-div');
                parent.title = tab.title;

                let tabLink = document.createElement('a');

                let beastImage = document.createElement("img");
                beastImage.setAttribute("src", tab.favIconUrl);
                // beastImage.style.height = "100vh";
                beastImage.className = "beastify-image";
                parent.appendChild(beastImage);

                tabLink.textContent = tab.title || tab.id;
                tabLink.setAttribute('href', tab.id);
                tabLink.classList.add('switch-tabs');
                parent.appendChild(tabLink);

                currentTabs.appendChild(parent);
            }

            counter += 1;
        }

        tabsList.appendChild(currentTabs);
    });
}

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
    return browser.tabs.query({ currentWindow: true });
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains('switch-tabs')) {
        var tabId = +e.target.getAttribute('href');

        browser.tabs.query({
            currentWindow: true
        }).then((tabs) => {
            for (var tab of tabs) {
                if (tab.id === tabId) {
                    browser.tabs.update(tabId, {
                        active: true
                    });
                }
            }
        });
    }

    e.preventDefault();
});

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.log(`The tab with id: ${tabId}, is closing`);

    if (removeInfo.isWindowClosing) {
        console.log(`Its window is also closing.`);
    } else {
        console.log(`Its window is not closing`);
    }
});

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
    var startIndex = moveInfo.fromIndex;
    var endIndex = moveInfo.toIndex;
    console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`);
});
