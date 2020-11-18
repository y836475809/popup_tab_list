/* globals browser */

function listTabs() {
    getCurrentWindowTabs().then((tabs) => {
        const tabs_list = document.getElementById("tabs-list");
        const current_tabs = document.createDocumentFragment();
        const limit = 500;
        let counter = 0;

        for (let tab of tabs) {
            if (counter > limit) {
                break;
            }

            const parent = document.createElement("div");
            parent.classList.add("tab-container");
            parent.title = tab.title;
            parent.dataset.tabid = tab.id;

            const tab_title = document.createElement("div");
            tab_title.classList.add("tab-title");
            tab_title.dataset.tabid = tab.id;
            tab_title.textContent = tab.title || tab.id;
            if (tab.active) {
                tab_title.classList.add("tab-title-active");
            }

            let favicon = null;
            if (tab.favIconUrl) {
                favicon = document.createElement("img");
                favicon.setAttribute("src", tab.favIconUrl);
            } else {
                favicon = document.createElement("div");
            }
            favicon.dataset.tabid = tab.id;
            favicon.className = "tab-favicon";

            parent.appendChild(favicon);
            parent.appendChild(tab_title);
            current_tabs.appendChild(parent);

            counter += 1;
        }

        tabs_list.appendChild(current_tabs);
    });
}

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
    return browser.tabs.query({ currentWindow: true });
}

document.addEventListener("mouseup", e => {
    if (e.button == 1) {
        window.close();
    }
    if (e.button == 2) {
        return;
    }
    if (e.target.classList.contains("tab-container")
        || e.target.classList.contains("tab-favicon")
        || e.target.classList.contains("tab-title")) {
        const ac_elm = document.querySelector(".tab-title-active");
        ac_elm.classList.remove("tab-title-active");

        const tabId = parseInt(e.target.dataset.tabid);
        const elms = document.querySelectorAll(".tab-title");
        for (let index = 0; index < elms.length; index++) {
            const elm = elms[index];
            if (parseInt(elm.dataset.tabid) == tabId) {
                elm.classList.add("tab-title-active");
                break;
            }
        }

        browser.tabs.query({
            currentWindow: true
        }).then((tabs) => {
            for (let tab of tabs) {
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

document.addEventListener("contextmenu", event => {
    event.preventDefault();
}, { capture: true });