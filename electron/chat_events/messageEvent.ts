type MessageObject = {
    "listener": string,
    "event": {
        "service": string,
        "data": {
            "time": number,
            "tags": TagsObject,
            "nick": string,
            "userId": number | string,
            "displayName": string,
            "displayColor": string,
            "profileImage": string,
            "badges": Badge[] | [],
            "channel": string,
            "text": string,
            "isAction": boolean,
            "emotes": Emote[] | [],
            "msgId": number | string
        },
        "renderedText": string
    }
}

type TagsObject = {
    "badge-info": string,
    "badges": string,
    "client-nonce": string,
    "color": string,
    "display-name": string,
    "emotes": string,
    "first-msg": string,
    "flags": string,
    "id": string,
    "mod": string,
    "returning-chatter": string,
    "room-id": string,
    "subscriber": string,
    "member": string,
    "tmi-sent-ts": string,
    "turbo": string,
    "user-id": string,
    "user-type": string
}

type Badge = {
    "type": string,
    "version": number | string,
    "url": string
}

type Emote = {
    "type": string,
    "version": number | string,
    "url": string
}

class MessageEvent {

    data: Record<string, any>;
    event: string;

    constructor(obj: Record<string, any>, evt: string) {
        this.data = obj;
        this.event = evt;
    }

    getMessageObject(): MessageObject {
        const authorName: string = this.data.authorName.simpleText;
        const authorPicture: string = this.data.authorPhoto.thumbnails[1].url;
        
        const badgeArray: Array<Badge> = [];

        const _badges: Array<any> | undefined = this.data.authorBadges;
        let badges: string = "";

        let userType: string = "";
        let isMod: string = '0';
        let isMember: string = '0';

        if (_badges) {
            for (let key in _badges) {

                const [type, amount] = this.getBadgeType(_badges[key].liveChatAuthorBadgeRenderer.tooltip)

                const badge: Badge = {
                    "type": type,
                    "version": "1",
                    "url": _badges[key].liveChatAuthorBadgeRenderer.customThumbnail.thumbnails[1]
                }

                badgeArray.push(badge)
                badges += (type + '/' + amount);

                isMod = type === 'Moderator' ? '1' : '0';
                isMod = type === 'Member' ? '1' : '0';

                userType = type === 'Broadcaster' ? 'owner' : '';
            }
        }

        const tags: TagsObject = {
            "badge-info": "",
            "badges": badges,
            "client-nonce": "",
            "color": "#FFFFFF",
            "display-name": authorName,
            "emotes": "",
            "first-msg": "0",
            "flags": "",
            "id": "",
            "mod": isMod,
            "returning-chatter": "0",
            "room-id": "",
            "subscriber": isMember,
            "member": isMember,
            "tmi-sent-ts": "",
            "turbo": "",
            "user-id": '',
            "user-type": userType
        }

        const detail: MessageObject = {
            "listener": this.event,
            "event": {
                "service": "youtube",
                "data": {
                    "time": Date.now(),
                    "tags": tags,
                    "nick": authorName,
                    "userId": this.data.authorExternalChannelId,
                    "displayName": authorName,
                    "displayColor": "#FFFFFF",
                    "profileImage": authorPicture,
                    "badges": badgeArray,
                    "channel": "",
                    "text": this.processMessageText(),
                    "isAction": false,
                    "emotes": [],
                    "msgId": this.data.id
                },
                "renderedText": this.renderMessageText()
            }
        }

        return detail
    }

    private getBadgeType(t: string): [string, number] {
        let type: string = "";
        let amount: number = 0;

        return [type, amount]
    }

    private processMessageText(): string {

        let message: string = "";
        const _a: Array<any> = this.data.message.runs;

        for (let key in _a) {
            if (_a[key].text) {
                message += (_a[key].text + " ");
            } 
            else if (_a[key].emoji) {
                message += (_a[key].emoji.shortcuts[0] + " ");
            } else {
                continue;
            }
        }

        return message;
    }

    private renderMessageText(): string {
        let message: string = "";
        const _a: Array<any> = this.data.message.runs;

        for (let key in _a) {
            if (_a[key].text) {
                message += (_a[key].text + " ");
            } 
            else if (_a[key].emoji) {
                message += (`<img src="${_a[key].emoji.image.thumbnails[0].url}">` + " ");
            } else {
                continue;
            }
        }

        return message;
    }
}

export default MessageEvent
