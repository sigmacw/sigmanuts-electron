const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CHAT_HISTORY_AMOUNT = 20;

var widgetName = window.location.pathname.split("/")[2];
var widgetCode = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] + "-" + Math.floor(Math.random() * 100000);

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function requestData() {
    var obj = JSON.stringify({
        "listener": "request-data",
        "name": widgetName
    })

    webSocket.send(obj).then(() => { requestHistory(); });
}

function requestHistory() {
    var obj = JSON.stringify({
        "listener": "request-history",
        "name": widgetName,
        "code": widgetCode,
        "amount": CHAT_HISTORY_AMOUNT
    })

    console.log(obj);

    webSocket.send(obj);
}

const webSocket = new WebSocket("ws://localhost:6970");

function waitForSocketConnection(socket, callback) {
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if (callback != null) {
                    callback();
                }
            } else {
                console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection...
}

waitForSocketConnection(webSocket, start)

async function start() {
    return
};


webSocket.onmessage = function (obj) {
    var evt = JSON.parse(obj);
    console.log(evt)

    if (evt.listener === "widget-load" && (evt.name === widgetName || evt.name === "all")) {
        console.log('pog')
        const event = new CustomEvent('onWidgetLoad', {
            detail: {
                fieldData: JSON.parse(evt.value)
            }
        });
        window.dispatchEvent(event)
    }
    else {
        if (evt.listener === "chat-history") {
            if (evt.name != widgetName || evt.code != widgetCode) {
                return;
            }
            evt = evt.value;
        }

        if (!evt.event) return;
        
        if(evt.listener === "message")
        {
            evt.event.data.text = decodeHtml(evt.event.data.text)
        }        
        const event = new CustomEvent('onEventReceived', {
            detail: {
                event: evt.event,
                listener: evt.listener
            }
        });
        
        window.dispatchEvent(event)
    }
}

window.addEventListener('DOMContentLoaded', function (obj) {
    start()
        .then(() => {
            requestData();
        });
})
