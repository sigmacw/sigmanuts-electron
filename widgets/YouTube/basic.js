$(document).ready(function () {

    window.addEventListener('onEventReceived', function (obj) {

        if (obj.detail.listener == "url-change") {
            clearMessages();
            return;
        }

        if (obj.detail.listener == "reconnect") {
            console.log("Chat reconnected");
            clearMessages();
            return;
        }

        if (obj.detail.listener == "delete-message") {
            let msgId = obj.detail.event.data.msgId;
            removeMessage(msgId);
            return;
        }

        if (obj.detail.listener !== "youtube-basic") return;

        
        let htmlText = obj.detail.event.renderedText;
        let id = obj.detail.event.data.msgId;
        let animate = true;
        if (obj.detail.event.type == "member-gifted") animate = false;

        console.log(obj);
        addElement(htmlText, animate, id);
    });

    window.addEventListener('onWidgetLoad', function (obj) {
        console.log("ONWIDGETLOAD");
        if (!obj.detail) return;
        console.log(obj.detail.fieldData);
        let fields = obj.detail.fieldData;

        if (fields.colorMode == "dark") {
            $("html").attr("dark", '');
            $("html").removeAttr("light");
        }
        else {
            $("html").attr("light", '');
            $("html").removeAttr("dark");
        }

        if (fields.transparentBg) {
            $("html").attr("transparent", '');
        }
        else {
           $("html").removeAttr("transparent");
        }
    });

});



function clearMessages() {
    $('yt-live-chat-item-list-renderer div#items').empty();
}

function removeMessage(msgId) {
    if (!msgId) return;

    //Some messages have %3D at the end of the id, breaking the code
    msgId = msgId.replaceAll(`%3D`, "");
    let elem = $(`#${msgId}`);
    if (elem) {
        elem.remove();
    }
}

function addElement(htmlText, animate, id) {
    if (!htmlText) return;
    element = `
    <yt-live-chat-text-message-renderer
        class="style-scope yt-live-chat-item-list-renderer"
        id="${id}" author-is-owner=""
        author-type="owner">
        <!--css-build:shady-->
        <yt-img-shadow id="author-photo"
            class="no-transition style-scope yt-live-chat-text-message-renderer"
            height="24" width="24"
            style="background-color: transparent;"
            loaded="">
            <!--css-build:shady--><img id="img"
                draggable="false"
                class="style-scope yt-img-shadow" alt=""
                height="24" width="24"
                src="./Sigmanuts _ Youtube Basic Chat_files/channels4_profile.jpg"></yt-img-shadow>
        <div id="content"
            class="style-scope yt-live-chat-text-message-renderer">
            <span id="timestamp"
                class="style-scope yt-live-chat-text-message-renderer">00:00
                PM</span>
            <yt-live-chat-author-chip
                class="style-scope yt-live-chat-text-message-renderer"
                is-highlighted="">
                <!--css-build:shady--><span
                    id="prepend-chat-badges"
                    class="style-scope yt-live-chat-author-chip"></span><span
                    id="author-name" dir="auto"
                    class="owner style-scope yt-live-chat-author-chip">Broadcaster
                    Name<span id="chip-badges"
                        class="style-scope yt-live-chat-author-chip"></span></span><span
                    id="chat-badges"
                    class="style-scope yt-live-chat-author-chip">
                    <yt-live-chat-author-badge-renderer
                        class="style-scope yt-live-chat-author-chip"
                        type="owner">
                        <!--css-build:shady-->
                        <div id="image"
                            class="style-scope yt-live-chat-author-badge-renderer">
                        </div>
                    </yt-live-chat-author-badge-renderer>
                </span></yt-live-chat-author-chip>&#8203;<span
                id="message" dir="auto"
                class="style-scope yt-live-chat-text-message-renderer">${htmlText}</span>
                <span
                id="deleted-state"
                class="style-scope yt-live-chat-text-message-renderer"></span><a
                id="show-original"
                href="http://localhost:6969/widgets/YouTube/widget.html#"
                class="style-scope yt-live-chat-text-message-renderer"></a>
        </div>
    </yt-live-chat-text-message-renderer>
    `;

    $('#items').append(element);

    if (animate) {
        let height = $(`#${id}`).outerHeight();

        $('#items').finish().css("transform", `translateY(${height}px)`).animate(
            {
                distance: height
            },
            {
                step: function (now, fx) {
                    if (fx.prop === "distance") {
                        $(this).css("transform", `translateY(${height - now}px)`);
                    }
                },
                complete: function () {
                    this.distance = 0;
                },
                duration: 80
            });
    }
}
