import Store from "../lib/store.js";
import Dispatcher from "../lib/dispatcher.js";

const dispatcher = new Dispatcher();
const storeData = new Store({
    currentPage: ""
});

dispatcher.register(
    function (payload) {
        switch (payload.actionType) {
            case "CHANGE_PAGE":
                storeData.trigger("click");
                break;
            default:
                break;
        }
    }
);

const myApp = {
    linkClickHandler: function (e) {
        event.preventDefault();
        const id = e.target.id;
        if (storeData.currentPage !== id) {
            this.getPage(id);
            localStorage.setItem("currentPage", id);
        }
    },

    switchPageCallback: function () {
        fetch(`/${storeData.currentPage}`)
            .then((response) => {
                return response.text();
            })
            .then((outHtml) => {
                document.getElementsByClassName("container")[0].innerHTML = outHtml;
                // init methods from bundle.js
                makeGesture();
                getVideoMonitoring();
            });
    },

    init: function () {
        this.getEventsHandler();
        storeData.bind("click", this.switchPageCallback);
        this.load();
    },

    load: function () {
        if (!localStorage.getItem("currentPage")) {
            localStorage.setItem("currentPage", "getMainPage");
            this.getPage("getMainPage");
        } else {
            this.getPage(localStorage.getItem("currentPage"));
        }
    },

    getEventsHandler: function () {
        const videoLink = document.getElementById("getMonitoringPage");
        const mainLink = document.getElementById("getMainPage");
        videoLink.onclick = this.linkClickHandler.bind(this);
        mainLink.onclick = this.linkClickHandler.bind(this);
    },

    getPage: function (name) {
        storeData.currentPage = name;
        dispatcher.dispatch({
            actionType: "CHANGE_PAGE",
            name: name
        })
    }
};

window.onload = myApp.init();
