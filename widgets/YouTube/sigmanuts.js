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

    webSocket.send(obj)
    requestHistory()
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

        }, 100); // wait 5 milisecond for the connection...
}

let processedMessages = [];
let previousMessage = "";

webSocket.onmessage = function (obj) {
    var evt = JSON.parse(obj.data);
    
    if (typeof evt === "string") {
        const response = JSON.parse(evt);
        const actions = response.continuationContents.liveChatContinuation.actions;

        if (!actions) return

        for (key in actions) {
            const _id = actions[key].addChatItemAction.clientId;

            if (previousMessage !== _id && processedMessages.length > 10) {
                processedMessages = [];
            }  

            if (processedMessages.includes(_id)) continue;

            processedMessages.push(_id);
            previousMessage = _id;

            console.log('__________')
            console.log(actions[key].addChatItemAction.item)
            console.log(actions[key].addChatItemAction.item.liveChatTextMessageRenderer.message.runs[0].text)
        }
    }

    if (evt.listener === "widget-load" && (evt.name === widgetName || evt.name === "all")) {
        console.log('pog')
        const event = new CustomEvent('onWidgetLoad', {
            detail: {
                fieldData: JSON.parse(evt.value)
            }
        });
        window.dispatchEvent(event)
    }
    /* else if (evt.listener === "url-change") {
        location.reloadS();
    } */
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
    waitForSocketConnection(webSocket, requestData)
})
